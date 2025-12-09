"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import config from "./config";
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./middleware/logger"));
const user_routes_1 = require("./modules/user/user.routes");
const auth_routes_1 = require("./modules/auth/auth.routes");
const vehicle_routes_1 = require("./modules/vehicle/vehicle.routes");
const booking_routes_1 = require("./modules/booking/booking.routes");
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
// app.use(express.urlencoded());
// initializing DB
(0, db_1.default)();
const apiPrefix = '/api/v1';
// "/" -> localhost:5000/
app.get("/", logger_1.default, (req, res) => {
    res.send("Hello Next Level Developers!");
});
const apiRouter = express_1.default.Router();
// users
apiRouter.use('/users', user_routes_1.userRoutes);
// auth
apiRouter.use('/auth', auth_routes_1.authRoutes);
// vehicles
apiRouter.use('/vehicles', vehicle_routes_1.vehicleRoutes);
// bookings
apiRouter.use('/bookings', booking_routes_1.bookingRoutes);
app.use(apiPrefix, apiRouter);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
exports.default = app;
