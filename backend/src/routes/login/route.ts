import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Router
export const loginRouter = Router();

// เราจะใช้ email + idCard สำหรับตรวจสอบล็อกอิน
interface Login {
  email: string;
  idCard: string;
}
// ประกาศ Schema บน Collection "users" เหมือนกับที่ใช้ใน register
// (แต่ที่นี่เรากำหนดเฉพาะ fields ที่ต้องใช้เช็ค login)
const loginSchema = new mongoose.Schema<Login>({
  email: { type: String, required: true },
  idCard: { type: String, required: true }
});

// ประกาศ Model ชื่อ 'users' (ตัวเดียวกับ register) แต่ Schema เป็น loginSchema
// Mongoose จะมองว่าเป็น Collection "users" (พหูพจน์) ใน DB
const userLoginModel = mongoose.model<Login>("users", loginSchema);

// ตั้ง SECRET_KEY ไว้ใช้เซ็น JWT (ควรเก็บใน .env แทนการฮาร์ดโค้ด)
const SECRET_KEY = "MY_SUPER_SECRET_KEY";

// POST /login
loginRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { email, idCard } = req.body;

    // (1) ตรวจสอบค่าว่าง
    if (!email || !idCard) {
      return res.status(400).json({ message: "Missing email or idCard" });
    }

    // (2) หา user จาก DB ด้วย email + idCard
    const foundUser = await userLoginModel.findOne({ email, idCard });
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or idCard" });
    }

    // (3) ถ้าเจอ => สร้าง JWT
    //      เราอาจเก็บข้อมูลใดก็ได้ใน payload เช่น _id, email
    const token = jwt.sign(
      { userId: foundUser._id, email: foundUser.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // (4) ตอบกลับ client ด้วย token
    return res.status(200).json({
      message: "Login success",
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error });
  }
});
