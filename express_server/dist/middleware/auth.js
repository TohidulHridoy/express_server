"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// higher order function. Returning function
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// roles = ["admin", "customer"]
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: "You are not allowed!!" });
            }
            const token = authHeader.substring(7); // Remove "Bearer " prefix
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            console.log({ decoded });
            req.user = decoded;
            // Check roles if specified
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden"
                });
            }
            next();
        }
        catch (err) {
            res.status(401).json({
                success: false,
                message: err.message,
            });
        }
    };
};
exports.default = auth;
