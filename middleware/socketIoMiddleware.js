module.exports = (io) => {
    return (req, res, next) => {
        if (!req.io) {
            req.io = io;
        }
        next();
    };
};