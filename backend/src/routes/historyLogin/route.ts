import mongoose, { Schema, Document, Model } from "mongoose";
import { Router, Request, Response } from "express";
import dayjs from "dayjs";

// Step 1: สร้างโมเดล HistoricalLoginModel
interface HistoricalLoginInterface extends Document {
  token: string;   // สำหรับเก็บ token
  dateTime: Date;  // สำหรับเก็บวันที่/เวลาการเข้าสู่ระบบ
  createdAt?: Date; // วันที่สร้าง (ถ้าต้องการ)
}

// สร้าง Schema สำหรับ HistoricalLogin
const historicalLoginSchema = new Schema<HistoricalLoginInterface>({
  token: { type: String, required: true },   // token ต้องมีค่า
  dateTime: { type: Date, required: true },   // เวลาที่บันทึกการเข้าสู่ระบบ
  createdAt: { type: Date, default: Date.now }, // วันที่/เวลาที่บันทึกการสร้างข้อมูล
});

// Step 2: สร้าง Model สำหรับ HistoricalLogin
const HistoricalLoginModel = mongoose.model<HistoricalLoginInterface>("HistoricalLogin", historicalLoginSchema, "historical_logins");

// Step 3: สร้าง API สำหรับบันทึก historical login
const historicalLoginRouter = Router();

// POST /registration/historicalLogin
historicalLoginRouter.post("/", async (req: Request, res: Response) => {
  try {
    // รับ Authorization token จาก header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Authorization token is required" });
    }

    const now = dayjs();
    const dateTime = now.toDate();

    // บันทึกข้อมูลการเข้าสู่ระบบใน HistoricalLoginModel
    const newLoginRecord = await HistoricalLoginModel.create({
      token,
      dateTime, // บันทึกวันที่/เวลาของการเข้าสู่ระบบ
    });

    return res.status(200).json({
      status: 200,
      msg: "success",
      data: {
        record: newLoginRecord._id,
      },
    });

  } catch (error) {
    console.error("Error on /registration/historicalLogin:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export { historicalLoginRouter };
