"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const db_1 = require("../../config/db");
const getUser = async () => {
    const result = await db_1.pool.query(`SELECT id, name, email, phone, role FROM users`);
    return result;
};
const updateUser = async (id, name, email, phone, role, userRole) => {
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
    }
    if (email !== undefined) {
        updates.push(`email = $${paramIndex++}`);
        values.push(email);
    }
    if (phone !== undefined) {
        updates.push(`phone = $${paramIndex++}`);
        values.push(phone);
    }
    if (role !== undefined && userRole === "admin") {
        updates.push(`role = $${paramIndex++}`);
        values.push(role);
    }
    if (updates.length === 0)
        return null;
    updates.push(`updated_at = NOW()`);
    values.push(id);
    const result = await db_1.pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, name, email, phone, role`, values);
    return result.rows[0];
};
const deleteUser = async (id) => {
    const bookingCheck = await db_1.pool.query(`SELECT COUNT(*) FROM bookings WHERE customer_id = $1 AND status = 'active'`, [id]);
    if (parseInt(bookingCheck.rows[0].count, 10) > 0) {
        throw new Error("Cannot delete user with active bookings");
    }
    const result = await db_1.pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result;
};
exports.userService = {
    getUser,
    updateUser,
    deleteUser,
};
