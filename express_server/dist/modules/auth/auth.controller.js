"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../config/db");
const auth_service_1 = require("./auth.service");
const signup = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const userRole = role || 'customer';
        if (!['admin', 'customer'].includes(userRole)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const result = await db_1.pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`, [name, email, hashed, phone, userRole]);
        return res.status(201).json({ success: true, message: "User registered successfully", data: result.rows[0] });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};
const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing email or password" });
        }
        const result = await auth_service_1.authServices.loginUser(email, password);
        if (!result) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const { user, token } = result;
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.authController = { signup, signin };
