import mongoose from "mongoose";

export interface TempAccountInterface {
  firstName: string;
  lastName: string;
  birthDate: Date;
  idCard: string;
  email: string;
  username: string;
  password: string;
  exp: Date;       // วันหมดอายุ
  createdAt?: Date;
  updatedAt?: Date;
}

// ประกาศ Schema
const tempAccountSchema = new mongoose.Schema<TempAccountInterface>({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  birthDate: { type: Date,   required: true },
  idCard:    { type: String, required: true },
  email:     { type: String, required: true },
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  exp:       { type: Date,   required: true },
  createdAt: { type: Date,   default: Date.now },
  updatedAt: { type: Date,   default: Date.now },
});

// กรณีอยากอัปเดต updatedAt ทุกครั้งก่อนเซฟก็ใช้ Hook pre-save
tempAccountSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

/** 
 * Model ชื่อ "TempAccount" -> Collection จริงใน DB อาจชื่อ "tempaccounts" 
 *   (Mongoose จะเติม s, หรือนำ Model Name ไปแปลงรูป) 
 * ถ้าอยากฟิกชื่อ collection ให้เป็น "temp_accounts" ชัดๆ ให้ใส่อาร์กิวเมนต์ 3: 
 * mongoose.model<TempAccountInterface>("TempAccount", tempAccountSchema, "temp_accounts")
 */
export const TempAccountModel = mongoose.model<TempAccountInterface>(
  "TempAccount", 
  tempAccountSchema,
  "temp_accounts"
);
