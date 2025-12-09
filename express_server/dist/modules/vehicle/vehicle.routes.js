"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = require("express");
const vehicle_controller_1 = require("./vehicle.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorize_1 = require("../../middleware/authorize");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(), (0, authorize_1.requireRole)('admin'), vehicle_controller_1.vehicleController.createVehicle);
router.get('/', vehicle_controller_1.vehicleController.getVehicles);
router.get('/:vehicleId', vehicle_controller_1.vehicleController.getVehicle);
router.put('/:vehicleId', (0, auth_1.default)(), (0, authorize_1.requireRole)('admin'), vehicle_controller_1.vehicleController.updateVehicle);
router.delete('/:vehicleId', (0, auth_1.default)(), (0, authorize_1.requireRole)('admin'), vehicle_controller_1.vehicleController.deleteVehicle);
exports.vehicleRoutes = router;
