"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAnyRole = exports.requireRole = void 0;
const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        if (user.role !== role) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireAnyRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!roles.includes(user.role))
            return res.status(403).json({ success: false, message: 'Forbidden' });
        next();
    };
};
exports.requireAnyRole = requireAnyRole;
