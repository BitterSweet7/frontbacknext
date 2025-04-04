import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "MY_SUPER_SECRET_KEY";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token", error });
  }
}
