import express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin"), userController.getUser);

router.put("/:userId", auth("admin", "customer"), userController.updateUser);

router.delete("/:userId", auth("admin"), userController.deleteUser);

export const userRoutes = router;