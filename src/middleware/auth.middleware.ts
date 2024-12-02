/// <reference path="../express.d.ts" />
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../schemas/user.entity";
import { AppDataSource } from "../config/data-source";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        data: null,
        error: { message: "Token not provided" },
      });
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    if (!decoded || !decoded.id) {
      res.status(401).json({
        data: null,
        error: { message: "Invalid token" },
      });
      return;
    }

    // Check if user exists
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.id });

    if (!user) {
      res.status(403).json({
        data: null,
        error: { message: "User does not exist" },
      });
      return;
    }

    // Attach user to request
    req.userId = user.id;
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      data: null,
      error: { message: "Unauthorized" },
    });
  }
};

