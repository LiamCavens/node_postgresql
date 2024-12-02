import { Request, Response, NextFunction } from "express";

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(403).json({
        data: null,
        error: { message: "Forbidden: User not authenticated" },
      });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({
        data: null,
        error: { message: "Forbidden: Admin access required" },
      });
      return;
    }

    next(); // Proceed if the user is an admin
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};
