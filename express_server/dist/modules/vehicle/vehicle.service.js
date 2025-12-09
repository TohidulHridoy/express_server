"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleService = void 0;
const db_1 = require("../../config/db");
const createVehicle = async (vehicle) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = vehicle;
    const status = availability_status ?? "available";
    const query = `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`;
    const values = [vehicle_name, type, registration_number, daily_rent_price, status];
    const result = await db_1.pool.query(query, values);
    return result.rows[0];
};
const getAllVehicles = async () => {
    const query = `SELECT * FROM vehicles ORDER BY id DESC`;
    const result = await db_1.pool.query(query);
    return result.rows;
};
const getVehicleById = async (id) => {
    const result = await db_1.pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    return result.rows[0];
};
const updateVehicle = async (id, updates) => {
    const fields = Object.keys(updates);
    if (fields.length === 0)
        return null;
    const setClause = fields.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const values = fields.map((k) => updates[k]);
    const query = `UPDATE vehicles SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const result = await db_1.pool.query(query, [id, ...values]);
    return result.rows[0];
};
const deleteVehicle = async (id) => {
    const bookingCheck = await db_1.pool.query(`SELECT COUNT(*) FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [id]);
    const activeCount = parseInt(bookingCheck.rows[0].count, 10);
    if (activeCount > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
    }
    await db_1.pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
    return;
};
exports.vehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
