import { Request, Response } from 'express';
import { vehicleService } from './vehicle.service';

const createVehicle = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const created = await vehicleService.createVehicle(payload);
    return res.status(201).json({ success: true, message: 'Vehicle created successfully', data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const list = await vehicleService.getAllVehicles();
    if (!list || list.length === 0) return res.status(200).json({ success: true, message: 'No vehicles found', data: [] });
    return res.status(200).json({ success: true, message: 'Vehicles retrieved successfully', data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId as string;
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    return res.status(200).json({ success: true, message: 'Vehicle retrieved successfully', data: vehicle });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId as string;
    const updates = req.body;
    const updated = await vehicleService.updateVehicle(vehicleId, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Vehicle not found or no fields to update' });
    return res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId as string;
    await vehicleService.deleteVehicle(vehicleId);
    return res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const vehicleController = { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle };
