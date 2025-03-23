// import { Router, request, response } from "express";
// import mongoose from "mongoose";

// export const registerRouter = Router();

// interface Register {
//     firstName: string;
//     lastName: string;
//     idCard: string;
//     birthDay: Date;
//     email: string;
// }
// //แบบ schema ของค่าที่บังคับใช้ใน mongodb database
// const registerSchemas = new mongoose.Schema<Register>({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     idCard: { type: String, required: true, unique: true },
//     birthDay: { type: Date, required: true },
//     email: { type: String, required: true },
// })
// //ODB Object Data Model สำหรับ mongodb database
// const user = mongoose.model('users', registerSchemas);

// registerRouter.post('/', async(request, response) => {
//     try {
//         const { firstName, lastName, idCard, birthDay, email } = request.body;

//         if (!firstName || !lastName || !idCard || !birthDay || !email) {
//             return response.status(400).json({ error: 'All fields are required' });
//           }
        
//         const newUser = await user.create({ firstName, lastName, idCard, birthDay, email });
//         return response.status(201).json(newUser);
//     } catch (error) {
//         if ((error as any).code === 11000) {
//             return response.status(400).json({
//               message: "คุณกรอกหมายเลขบัตรประชาชนซ้ำ, โปรดใช้หมายเลขบัตรประชาชนอื่น",
//               field: "idCard"
//             });
//           }
//         return response.status(500).json({ error });
//     }
// }
// );