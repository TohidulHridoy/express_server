"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const getUser = async (req, res) => {
    try {
        const result = await user_service_1.userService.getUser();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const authUser = req.user;
        const userId = req.params.userId;
        const { name, email, phone, role } = req.body;
        if (authUser.role === "customer" && Number(authUser.id) !== Number(userId)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        const updated = await user_service_1.userService.updateUser(userId, name, email, phone, role, authUser.role);
        if (!updated) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User updated successfully", data: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await user_service_1.userService.deleteUser(userId);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.userController = {
    getUser,
    updateUser,
    deleteUser,
};
