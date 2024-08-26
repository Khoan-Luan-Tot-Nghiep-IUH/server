const BusType = require('../models/BusType');

// Tạo loại xe buýt mới
exports.createBusType = async (req, res) => {
    try {
        const { name, description, seats, floorCount } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || seats === undefined || seats <= 0) {
            return res.status(400).json({ success: false, message: 'Name and a valid number of seats are required' });
        }

        const newBusType = new BusType({
            name,
            description,
            seats,
            floorCount: floorCount || 1 // Mặc định là 1 tầng nếu không có giá trị
        });

        await newBusType.save();
        res.status(201).json({ success: true, data: newBusType });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create bus type', error: err.message });
    }
};

// Lấy danh sách tất cả các loại xe buýt với phân trang
exports.getBusTypes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const busTypes = await BusType.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await BusType.countDocuments();

        res.status(200).json({
            success: true,
            data: busTypes,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get bus types', error: err.message });
    }
};

exports.getBusTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const busType = await BusType.findById(id);

        if (!busType) {
            return res.status(404).json({ success: false, message: 'Bus type not found' });
        }

        res.status(200).json({ success: true, data: busType });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get bus type', error: err.message });
    }
};

exports.updateBusType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, seats, floorCount } = req.body;

        if (!name && !description && seats === undefined && floorCount === undefined) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (seats !== undefined && seats > 0) updates.seats = seats;
        if (floorCount !== undefined && floorCount > 0) updates.floorCount = floorCount;

        const updatedBusType = await BusType.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedBusType) {
            return res.status(404).json({ success: false, message: 'Bus type not found' });
        }

        res.status(200).json({ success: true, data: updatedBusType });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update bus type', error: err.message });
    }
};

exports.deleteBusType = async (req, res) => {
    try {
        const { id } = req.params;
        const associatedTrips = await Trip.find({ busType: id });
        if (associatedTrips.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete BusType associated with existing trips' });
        }

        const deletedBusType = await BusType.findByIdAndDelete(id);

        if (!deletedBusType) {
            return res.status(404).json({ success: false, message: 'Bus type not found' });
        }

        res.status(200).json({ success: true, message: 'Bus type deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete bus type', error: err.message });
    }
};

exports.getBusTypeNames = async (req, res) => {
    try {
        const busTypeNames = await BusType.find().select('name');
        res.status(200).json({ success: true, data: busTypeNames });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get bus type names', error: err.message });
    }
};
