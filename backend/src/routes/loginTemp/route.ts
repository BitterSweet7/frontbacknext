import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { TempAccountModel } from "../../models/tempAccount.model";  // << สำคัญ

export const tempLoginRouter = Router();

const SECRET_KEY = "MY_SUPER_SECRET_KEY";

// POST /tempLogin
tempLoginRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // ใช้ TempAccountModel (ที่ import มา) เพื่อตรวจ DB
    const foundAccount = await TempAccountModel.findOne({ username });
    console.log("foundAccount=", foundAccount);

    if (!foundAccount) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // เช็คพาสเวิร์ด
    if (foundAccount.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // เช็ควันหมดอายุ
    if (dayjs().isAfter(dayjs(foundAccount.exp))) {
      return res.status(403).json({ message: "This temp account is expired" });
    }

    // สร้าง JWT
    const token = jwt.sign(
      { username: foundAccount.username },
      SECRET_KEY,
      { expiresIn: "15s" }
    );

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: {token: token}
    });

  } catch (error) {
    console.error("tempLogin error:", error);
    return res.status(500).json({ error });
  }
});
