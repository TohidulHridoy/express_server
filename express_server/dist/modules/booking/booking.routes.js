"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorize_1 = require("../../middleware/authorize");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(), (0, authorize_1.requireAnyRole)(['admin', 'customer']), booking_controller_1.bookingController.createBooking);
router.get('/', (0, auth_1.default)(), (0, authorize_1.requireAnyRole)(['admin', 'customer']), booking_controller_1.bookingController.getBookings);
router.put('/:bookingId', (0, auth_1.default)(), (0, authorize_1.requireAnyRole)(['admin', 'customer']), booking_controller_1.bookingController.updateBooking);
exports.bookingRoutes = router;
