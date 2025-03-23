import { Router, Request, Response } from "express";
import dayjs from "dayjs";
// Import Model ตัวเดียวจากไฟล์ model
import { TempAccountModel } from "../../models/tempAccount.model";

export const tempAccountRouter = Router();

tempAccountRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, birthDate, idCard, email } = req.body;

    if (!firstName || !lastName || !birthDate || !idCard || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const now = dayjs();
    const year = now.format("YYYY");
    const month = now.format("MM");
    const day = now.format("DD");

    // ตัวอย่าง Username
    const baseUsername = `TA${year}${month}${day}`;

    // ค้นหาว่ามีเลขของวันนี้แล้วกี่อัน
    const count = await TempAccountModel.countDocuments({
      username: new RegExp(`^${baseUsername}`),
    });

    // สร้างหมายเลขที่เพิ่มเข้ามา (เช่น TA2025020201, TA2025020202, ...)
    const number = count + 1;  // ใช้หมายเลขลำดับ
    const username = `${baseUsername}${number}`;

    // Password = 6 หลักท้ายของ idCard
    const password = idCard.slice(-6);

    // exp = บวก 30 นาที
    const expireTime = now.add(30, "minute").toDate();

    // สร้าง Document
    const newTempAccount = await TempAccountModel.create({
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      idCard,
      email,
      username,
      password,
      exp: expireTime,
    });

    return res.status(200).json({
      status: 200,
      msg: "success",
      data: {
        username: newTempAccount.username,
        password: newTempAccount.password,
        exp: dayjs(newTempAccount.exp).format("YYYY-MM-DD HH:mm:ss"),
      },
    });

  } catch (error) {
    console.error("Error on /registration/tempAccount:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});
