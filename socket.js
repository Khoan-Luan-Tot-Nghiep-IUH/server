const mongoose = require('mongoose');
const Seat = require('./models/Seat');

module.exports = (io) => {
    const connectedUsers = new Map();
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('joinTrip', (tripId) => {
            socket.join(`trip:${tripId}`);
            console.log(`Socket ${socket.id} joined trip room: trip:${tripId}`);
          });          
        socket.on('reserveSeat', async ({ tripId, seatNumber, userId }) => {
            console.log('Attempting to reserve seat:', { tripId, seatNumber, userId });
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    const seat = await Seat.findOne({
                        trip: tripId,
                        seatNumber,
                        isAvailable: true,
                        isLocked: false
                    });
        
                    if (!seat) {
                        socket.emit('seatUnavailable', { tripId, seatNumber });
                        return;
                    }
                    const updatedSeat = await Seat.findOneAndUpdate(
                        {
                            _id: seat._id,
                            version: seat.version 
                        },
                        {
                            $set: {
                                isLocked: true,
                                lockedBy: new mongoose.Types.ObjectId(userId),
                                lockExpiration: new Date(Date.now() + 5 * 60000)
                            },
                            $inc: { version: 1 }
                        },
                        { new: true, session }
                    );
        
                    if (updatedSeat) {
                        io.to(`trip:${tripId}`).emit('seatLocked', {
                            tripId,
                            seatNumber,
                            lockedBy: userId,
                            lockExpiration: updatedSeat.lockExpiration
                        });
        
                        connectedUsers.set(socket.id, {
                            userId,
                            lockedSeats: [...(connectedUsers.get(socket.id)?.lockedSeats || []), { tripId, seatNumber }]
                        });
                    } else {
                        socket.emit('seatUnavailable', { tripId, seatNumber });
                    }
                });
            } catch (error) {
                console.error('Error reserving seat:', error);
                socket.emit('error', {
                    type: 'RESERVE_ERROR',
                    message: 'Failed to reserve seat',
                    details: error.message
                });
            } finally {
                session.endSession();
            }
        });
        

        socket.on('releaseSeat', async ({ tripId, seatNumber, userId }) => {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    const seat = await Seat.findOneAndUpdate(
                        {
                            trip: tripId,
                            seatNumber,
                            lockedBy: new mongoose.Types.ObjectId(userId),
                            isLocked: true
                        },
                        {
                            $set: {
                                isLocked: false,
                                lockedBy: null,
                                lockExpiration: null
                            },
                            $inc: { version: 1 }
                        },
                        { new: true, session }
                    );

                    if (seat) {
                        io.to(`trip:${tripId}`).emit('seatReleased', { tripId, seatNumber });
                        const userData = connectedUsers.get(socket.id);
                        if (userData) {
                            userData.lockedSeats = userData.lockedSeats.filter(
                                s => !(s.tripId === tripId && s.seatNumber === seatNumber)
                            );
                            connectedUsers.set(socket.id, userData);
                        }
                    }
                });
            } catch (error) {
                console.error('Error releasing seat:', error);
                socket.emit('error', {
                    type: 'RELEASE_ERROR',
                    message: 'Failed to release seat',
                    details: error.message
                });
            } finally {
                session.endSession();
            }
        });

        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
            const userData = connectedUsers.get(socket.id);
            if (userData?.lockedSeats?.length) {
                const session = await mongoose.startSession();
                try {
                    await session.withTransaction(async () => {
                        for (const { tripId, seatNumber } of userData.lockedSeats) {
                            await Seat.findOneAndUpdate(
                                {
                                    trip: tripId,
                                    seatNumber,
                                    lockedBy: new mongoose.Types.ObjectId(userData.userId)
                                },
                                {
                                    $set: {
                                        isLocked: false,
                                        lockedBy: null,
                                        lockExpiration: null
                                    },
                                    $inc: { version: 1 }
                                },
                                { session }
                            );
                            
                            io.to(`trip:${tripId}`).emit('seatReleased', { tripId, seatNumber });
                        }
                    });
                } catch (error) {
                    console.error('Error auto-releasing seats:', error);
                } finally {
                    session.endSession();
                }
            }
            
            connectedUsers.delete(socket.id);
        });
    });
    setInterval(async () => {
        try {
            const expiredSeats = await Seat.find({
                isLocked: true,
                lockExpiration: { $lt: new Date() }
            });

            for (const seat of expiredSeats) {
                await Seat.findByIdAndUpdate(seat._id, {
                    $set: {
                        isLocked: false,
                        lockedBy: null,
                        lockExpiration: null
                    },
                    $inc: { version: 1 }
                });

                io.to(`trip:${seat.trip}`).emit('seatReleased', {
                    tripId: seat.trip,
                    seatNumber: seat.seatNumber
                });
            }
        } catch (error) {
            console.error('Error cleaning up expired locks:', error);
        }
    }, 60000); 
};