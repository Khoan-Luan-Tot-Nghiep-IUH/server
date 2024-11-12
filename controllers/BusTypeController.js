const BusType = require('../models/BusType');
const Trip = require('../models/Trip');
const {uploadImage}  = require('../config/cloudinaryConfig');

exports.createBusType = async (req, res) => {
  try {
    const { name, description, seats, floorCount } = req.body;
    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: CompanyId is required.' });
    }
    if (!name || seats === undefined || seats <= 0) {
      return res.status(400).json({ success: false, message: 'Name and a valid number of seats are required' });
    }

    let imageUrls = [];

    if (req.files) {
      for (const file of req.files) {
        const { url } = await uploadImage(file.path, 'bus_types');
        imageUrls.push(url);
      }
    }

    const newBusType = new BusType({
      name,
      description,
      seats,
      floorCount: floorCount || 1,
      companyId,
      images: imageUrls
    });

    await newBusType.save();
    res.status(201).json({ success: true, data: newBusType });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create bus type', error: err.message });
  }
};

exports.getBusTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const companyId = req.user.companyId; 

    if (!companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access: CompanyId is required.' });
    }

    const busTypes = await BusType.find({ companyId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await BusType.countDocuments({ companyId });

    res.status(200).json({
      success: true,
      data: busTypes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get bus types', error: err.message });
  }
};

exports.getBusTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const busType = await BusType.findOne({ _id: id, companyId });

    if (!busType) {
      return res.status(404).json({ success: false, message: 'Bus type not found or access denied.' });
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
    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access: CompanyId is required.' });
    }

    if (!name && !description && seats === undefined && floorCount === undefined) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (seats !== undefined && seats > 0) updates.seats = seats;
    if (floorCount !== undefined && floorCount > 0) updates.floorCount = floorCount;
    const updatedBusType = await BusType.findOneAndUpdate({ _id: id, companyId }, updates, { new: true });

    if (!updatedBusType) {
      return res.status(404).json({ success: false, message: 'Bus type not found or access denied.' });
    }

    res.status(200).json({ success: true, data: updatedBusType });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update bus type', error: err.message });
  }
};

exports.deleteBusType = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access: CompanyId is required.' });
    }

    const associatedTrips = await Trip.find({ busType: id, companyId }); // Chỉ tìm các chuyến đi thuộc công ty hiện tại
    if (associatedTrips.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete BusType associated with existing trips.' });
    }

    const deletedBusType = await BusType.findOneAndDelete({ _id: id, companyId });

    if (!deletedBusType) {
      return res.status(404).json({ success: false, message: 'Bus type not found or access denied.' });
    }

    res.status(200).json({ success: true, message: 'Bus type deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete bus type', error: err.message });
  }
};


exports.getBusTypeNames = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const busTypeNames = await BusType.find({ companyId }).select('name');
    res.status(200).json({ success: true, data: busTypeNames });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get bus type names', error: err.message });
  }
};

exports.getAllBusType = async (req, res) => {
  try {
    const busTypeNames = await BusType.find().select('name floorCount -_id');
    res.status(200).json({ success: true, data: busTypeNames });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get bus type names', error: err.message });
  }
};
