import dotenv from "dotenv";
import express from "express";
import logger from "./utils/logger";
import { authenticate } from "./middleware/auth.middleware";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";
import healthcheckRoutes from "./routes/healthcheckRoutes";

import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express();

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err) => {
    logger.error(`Error during Data Source initialization: ${err.message}`);
  });

logger.info(
  `Application running in ${process.env.NODE_ENV || "development"} mode`
);

// Use routes with authentication
app.use("/api/products", authenticate, productRoutes);
app.use("/api/profile/cart", authenticate, cartRoutes);
app.use("/api/orders", authenticate, orderRoutes);
app.use("/api/auth", authenticate, authRoutes);
app.use("/api/healthcheck", healthcheckRoutes);

// Error Handling Middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });
  }
);

export default app;
