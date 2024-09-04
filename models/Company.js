const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
