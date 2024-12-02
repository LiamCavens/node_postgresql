import { Request, Response } from "express";
import logger from "../utils/logger";
import { AppDataSource } from "../config/data-source";
import { User } from "../schemas/user.entity";

// Get the user profile
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId; // Assuming `authenticate` middleware attaches `userId` to `req`

    if (!userId) {
      res.status(401).json({
        data: null,
        error: { message: "Unauthorized: User ID is missing" },
      });
      return;
    }

    // Retrieve the user from the database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(404).json({
        data: null,
        error: { message: "User not found" },
      });
      return;
    }

    // Respond with the user profile
    res.status(200).json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      error: null,
    });
  } catch (error) {
    logger.error("Error fetching user profile:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};
