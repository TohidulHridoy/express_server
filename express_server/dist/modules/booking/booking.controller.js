"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const createBooking = async (req, res) => {
    try {
        const authUser = req.user;
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        if (!vehicle_id || !rent_start_date || !rent_end_date) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        if (authUser.role === "customer" && (!customer_id || customer_id !== authUser.id)) {
            return res.status(400).json({ success: false, message: "Invalid customer ID" });
        }
        const customerId = authUser.role === "admin" ? customer_id : authUser.id;
        const booking = await booking_service_1.bookingService.createBooking(customerId, Number(vehicle_id), rent_start_date, rent_end_date);
        return res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
const getBookings = async (req, res) => {
    try {
        const authUser = req.user;
        const bookings = await booking_service_1.bookingService.getBookings(authUser.id, authUser.role);
        const message = authUser.role === "admin" ? "Bookings retrieved successfully" : "Your bookings retrieved successfully";
        return res.status(200).json({ success: true, message, data: bookings });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const updateBooking = async (req, res) => {
    try {
        const authUser = req.user;
        const { status } = req.body;
        const bookingId = req.params.bookingId;
        if (!status)
            return res.status(400).json({ success: false, message: "Missing status" });
        const updated = await booking_service_1.bookingService.updateBookingStatus(bookingId, status, authUser.id, authUser.role);
        const message = status === "cancelled"
            ? "Booking cancelled successfully"
            : status === "returned"
                ? "Booking marked as returned. Vehicle is now available"
                : "Booking updated";
        return res.status(200).json({ success: true, message, data: updated });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.bookingController = { createBooking, getBookings, updateBooking };
