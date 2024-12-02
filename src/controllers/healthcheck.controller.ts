import { Request, Response } from "express";
import logger from "../utils/logger";
import { AppDataSource } from "../config/data-source";

export const healthcheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check database connection
    if (!AppDataSource.isInitialized) {
      logger.error("Healthcheck failed: Database is not connected");
      res.status(500).json({
        data: null,
        error: { message: "Database is not connected" },
      });
      return;
    }

    // If everything is fine
    logger.info("Healthcheck successful: Server and database are running");
    res.status(200).json({
      data: { message: "Server and database are running" },
      error: null,
    });
  } catch (error) {
    logger.error("Healthcheck failed:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};
