import express, { Request, Response } from "express";
// import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();
// parser
app.use(express.json());
// app.use(express.urlencoded());

// initializing DB
initDB();

const apiPrefix = '/api/v1';

// "/" -> localhost:5000/
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

const apiRouter = express.Router();

// users
apiRouter.use('/users', userRoutes);

// auth
apiRouter.use('/auth', authRoutes);

// vehicles
apiRouter.use('/vehicles', vehicleRoutes);

// bookings
apiRouter.use('/bookings', bookingRoutes);

app.use(apiPrefix, apiRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;