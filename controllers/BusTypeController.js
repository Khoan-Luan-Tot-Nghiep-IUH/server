const BusType = require('../models/BusType');

// Tạo loại xe buýt mới
exports.createBusType = async (req, res) => {
    try {
        const { name, description, seats } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || seats === undefined) {
            return res.status(400).json({ success: false, message: 'Name and seats are required' });
        }

        const newBusType = new BusType({
            name,
            description,
            seats
        });

        await newBusType.save();
        res.status(201).json({ success: true, data: newBusType });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create bus type', error: err.message });
    }
};

// Lấy danh sách tất cả các loại xe buýt
exports.getBusTypes = async (req, res) => {
    try {
        const busTypes = await BusType.find();
        res.status(200).json({ success: true, data: busTypes });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get bus types', error: err.message });
    }
};

// Lấy chi tiết một loại xe buýt cụ thể
exports.getBusTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const busType = await BusType.findById(id);

        if (!busType) {
            return res.status(404).json({ success: false, message: 'Bus type not found' });
        }

        res.status(200).json({ success: true, data: busType });
    } catch (err) {
        res.status (500).json({ success: false, message: 'Failed to get bus type', error: err.message });
    }
};

// Cập nhật thông tin loại xe buýt
exports.updateBusType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, seats } = req.body;

        if (!name && !description && seats === undefined) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (seats !== undefined) updates.seats = seats;

        const updatedBusType = await BusType.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedBusType) {
            return res.status(404).json({ success: false, message: 'Bus type not found' });
        }

        res.status(200).json({ success: true, data: updatedBusType });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update bus type', error: err.message });
    }
};

// Xóa loại xe buýt
exports.deleteBusType = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBusType = await BusType.findByIdAndDelete(id);

        if (!deletedBusType) {
            return res.status(404).json({ success: false, message: 'Bus type not found' });
        }

        res.status(200).json({ success: true, message: 'Bus type deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete bus type', error: err.message });
    }
};

// Lấy danh sách tên của các loại xe buýt
exports.getBusTypeNames = async (req, res) => {
    try {
        const busTypeNames = await BusType.find().select('name');
        res.status(200).json({ success: true, data: busTypeNames });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get bus type names', error: err.message });
    }
};
