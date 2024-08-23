const BusType = require('../models/BusType');

const calculateArrivalTime = (departureLocation, arrivalLocation, departureTime) => {
    // Đây chỉ là logic đơn giản giả định, bạn cần thay thế bằng cách tính toán thực tế
    const estimatedTravelTimeInHours = 8; // Giả sử thời gian di chuyển là 8 giờ
    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(departureDate.getTime() + estimatedTravelTimeInHours * 60 * 60 * 1000);
    return arrivalDate;
};

// Xác định loại xe buýt dựa trên số lượng hành khách
const determineBusType = async (numberOfPassengers) => {
    // Lựa chọn loại xe buýt phù hợp dựa trên số lượng hành khách
    if (numberOfPassengers <= 30) {
        return await BusType.findOne({ name: 'Xe Buýt Đơn' });
    } else if (numberOfPassengers <= 50) {
        return await BusType.findOne({ name: 'Xe Buýt Đôi' });
    } else {
        return await BusType.findOne({ name: 'Xe Buýt Lớn' });
    }
};

// Xác định tổng số ghế dựa trên loại xe buýt và số lượng hành khách
const determineTotalSeats = (numberOfPassengers) => {
    // Giả định tổng số ghế được xác định dựa trên số lượng hành khách (có thể tùy chỉnh)
    return Math.max(30, numberOfPassengers);
};

module.exports = {
    calculateArrivalTime,
    determineBusType,
    determineTotalSeats
};
