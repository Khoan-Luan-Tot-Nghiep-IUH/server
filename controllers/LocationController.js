const Location = require('../models/Location');

exports.createLocation = async (req, res) => {
    try {
        const { name, address, city, coordinates } = req.body;
        if (!name || !address || !city || !coordinates) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newLocation = new Location({
            name,
            address,
            city,
            coordinates: {  
                type: 'Point',
                coordinates
            }
        });

        await newLocation.save();
        res.status(201).json({ success: true, data: newLocation });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create location', error: err.message });
    }
};

// Lấy danh sách tất cả các địa điểm
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json({ success: true, data: locations });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get locations', error: err.message });
    }
};

// Lấy chi tiết một địa điểm cụ thể
exports.getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        res.status(200).json({ success: true, data: location });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get location', error: err.message });
    }
};

// Cập nhật thông tin địa điểm
exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Cập nhật dữ liệu địa điểm
        const updatedLocation = await Location.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedLocation) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        res.status(200).json({ success: true, data: updatedLocation });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update location', error: err.message });
    }
};

// Xóa địa điểm
exports.deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLocation = await Location.findByIdAndDelete(id);

        if (!deletedLocation) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        res.status(200).json({ success: true, message: 'Location deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete location', error: err.message });
    }
};
