const authenticateSession = (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: "Access denied. Please log in." });
    }
    next();
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.userType !== role) {
            return res.status(403).json({ success: false, message: `Access forbidden for ${req.session.user.userType}` });
        }
        next();
    };
};

module.exports = { authenticateSession, authorizeRole };