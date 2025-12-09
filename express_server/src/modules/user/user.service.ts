import { pool } from "../../config/db";
import bcrypt from "bcryptjs";


const getUser = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
    return result;
};

const updateUser = async (
    id: string,
    name?: string,
    email?: string,
    phone?: string,
    role?: string,
    userRole?: string
) => {
    const updates: string[] = [];
    const values: any[] = [];
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

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
        `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, name, email, phone, role`,
        values
    );

    return result.rows[0];
};


const deleteUser = async (id: string) => {
    const bookingCheck = await pool.query(
        `SELECT COUNT(*) FROM bookings WHERE customer_id = $1 AND status = 'active'`,
        [id]
    );

    if (parseInt(bookingCheck.rows[0].count, 10) > 0) {
        throw new Error("Cannot delete user with active bookings");
    }

    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result;
};

export const userService = {
    getUser,
    updateUser,
    deleteUser,
};