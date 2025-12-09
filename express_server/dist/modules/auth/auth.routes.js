"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.authController.signup);
router.post('/signin', auth_controller_1.authController.signin);
exports.authRoutes = router;
