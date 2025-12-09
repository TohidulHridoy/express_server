import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import { authServices } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const userRole = role || 'customer';
    if (!['admin', 'customer'].includes(userRole)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
      [name, email, hashed, phone, userRole]
    );

    return res.status(201).json({ success: true, message: "User registered successfully", data: result.rows[0] });
  } catch (err: any) {
    if (err.code === '23505') { 
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const result = await authServices.loginUser(email, password);
    if (!result) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { user, token } = result as any;

    return res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      data: { 
        token, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      } 
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const authController = { signup, signin };