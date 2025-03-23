import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
// import { registerRouter } from "./register/route";
import { loginRouter } from "./routes/login/route"; 
import { tempAccountRouter } from "./routes/tempAccount/route";
import { tempLoginRouter } from "./routes/loginTemp/route";
import { historicalLoginRouter} from "./routes/historyLogin/route";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

mongoose.connect("mongodb://127.0.0.1:27017/CSI402")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection error:", err));


// app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/registration/tempAccount", tempAccountRouter);
app.use("/registration/tempLogin", tempLoginRouter)
app.use("/registration/historicalSignin", historicalLoginRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
