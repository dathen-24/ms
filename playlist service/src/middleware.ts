import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string;
  file?: Express.Multer.File;
}

export const isAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }

    const decodedData: any = jwt.verify(
      token,
      process.env.JWT_SEC as string
    );

    req.user = decodedData._id;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Invalid Token",
    });
    return;
  }
};

export type { AuthenticatedRequest };

import multer from "multer";

const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage,
}).single("file");