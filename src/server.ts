import app from "./app";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1); // Exit with failure code
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down the server...");
  server.close(() => {
    logger.info("Server closed.");
  });
});
