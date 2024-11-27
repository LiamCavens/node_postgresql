import dotenv from "dotenv";
import express from "express";
import { authenticate } from "./middleware/auth.middleware";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

import { AppDataSource } from "./config/data-source";


dotenv.config();

const app = express();

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// Use routes with authentication
app.use("/api/products", authenticate, productRoutes);
app.use("/api/profile/cart", authenticate, cartRoutes);
app.use("/api/orders", authenticate, orderRoutes);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

export default app;
