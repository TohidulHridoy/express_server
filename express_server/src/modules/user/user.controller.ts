import { Request, Response } from "express";
import { userService } from "./user.service";


const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


const updateUser = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = req.params.userId as string;
    const { name, email, phone, role } = req.body;

    if (authUser.role === "customer" && Number(authUser.id) !== Number(userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await userService.updateUser(userId, name, email, phone, role, authUser.role);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User updated successfully", data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    await userService.deleteUser(userId);

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const userController = {
  getUser,
  updateUser,
  deleteUser,
};