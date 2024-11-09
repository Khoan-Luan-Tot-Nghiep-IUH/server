const mongoose = require('mongoose');
const Seat = require('./models/Seat');

module.exports = (io) => {
    const connectedUsers = new Map();
    
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        
        socket.on('joinTrip', (tripId) => {
            if (!tripId) return;
            socket.join(`trip:${tripId}`);
            console.log(`Socket ${socket.id} joined trip room: trip:${tripId}`);
        });

        socket.on('leaveTrip', (tripId) => {
            if (!tripId) return;
            socket.leave(`trip:${tripId}`);
            console.log(`Socket ${socket.id} left trip room: trip:${tripId}`);
            releaseUserSeats(socket.id, tripId);  // Giải phóng ghế khi người dùng rời phòng
        });

        socket.on('reserveSeat', async ({ tripId, seatNumber, userId }) => {
            if (!tripId || !seatNumber || !userId) return;

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
            console.log(`Releasing seat ${seatNumber} for trip ${tripId}`);
            if (!tripId || !seatNumber || !userId) return;
            console.log(`Releasing seat ${seatNumber} for trip ${tripId}`);
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
                        if (seatReleased) {
                            io.to(`trip:${tripId}`).emit('seatReleased', { seatNumber });
                        }                        
                        console.log(`Backend: Seat ${seatNumber} for trip ${tripId} has been released.`);                        
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
            await releaseUserSeats(socket.id); // Giải phóng ghế khi người dùng ngắt kết nối
            connectedUsers.delete(socket.id);
        });

        // Hàm giải phóng ghế
        async function releaseUserSeats(socketId, tripId) {
            const userData = connectedUsers.get(socketId);
            if (userData?.lockedSeats?.length) {
                const session = await mongoose.startSession();
                try {
                    await session.withTransaction(async () => {
                        for (const { tripId: seatTripId, seatNumber } of userData.lockedSeats) {
                            if (tripId && seatTripId !== tripId) continue; // Giải phóng ghế cho trip cụ thể nếu có
                            await Seat.findOneAndUpdate(
                                {
                                    trip: seatTripId,
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
                            
                            io.to(`trip:${seatTripId}`).emit('seatReleased', { tripId: seatTripId, seatNumber });
                        }
                    });
                } catch (error) {
                    console.error('Error auto-releasing seats:', error);
                } finally {
                    session.endSession();
                }
            }
        }
    });

    // Cron job giải phóng ghế đã hết hạn
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
