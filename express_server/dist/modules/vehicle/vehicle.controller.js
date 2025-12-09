"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleController = void 0;
const vehicle_service_1 = require("./vehicle.service");
const createVehicle = async (req, res) => {
    try {
        const payload = req.body;
        const created = await vehicle_service_1.vehicleService.createVehicle(payload);
        return res.status(201).json({ success: true, message: 'Vehicle created successfully', data: created });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const getVehicles = async (req, res) => {
    try {
        const list = await vehicle_service_1.vehicleService.getAllVehicles();
        if (!list || list.length === 0)
            return res.status(200).json({ success: true, message: 'No vehicles found', data: [] });
        return res.status(200).json({ success: true, message: 'Vehicles retrieved successfully', data: list });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const getVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;
        const vehicle = await vehicle_service_1.vehicleService.getVehicleById(vehicleId);
        if (!vehicle)
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        return res.status(200).json({ success: true, message: 'Vehicle retrieved successfully', data: vehicle });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;
        const updates = req.body;
        const updated = await vehicle_service_1.vehicleService.updateVehicle(vehicleId, updates);
        if (!updated)
            return res.status(404).json({ success: false, message: 'Vehicle not found or no fields to update' });
        return res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;
        await vehicle_service_1.vehicleService.deleteVehicle(vehicleId);
        return res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.vehicleController = { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle };
