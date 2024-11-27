import { Request, Response } from "express";
import {
  createOrderFromCart,
  getOrdersForUser,
} from "../services/order.service";
import { AppDataSource } from "../config/data-source";
import { User } from "../schemas/user.entity";

// Create a new order from the cart
export const createOrder = async (
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

    // Verify the user exists
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(404).json({
        data: null,
        error: { message: "User not found" },
      });
      return;
    }

    // Create the order from the cart
    const order = await createOrderFromCart(userId);

    if (!order) {
      res.status(400).json({
        data: null,
        error: {
          message: "Cannot create order. Cart may be empty or invalid.",
        },
      });
      return;
    }

    res.status(201).json({
      data: order,
      error: null,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};

// Get all orders for the authenticated user
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        data: null,
        error: { message: "Unauthorized: User ID is missing" },
      });
      return;
    }

    // Verify the user exists
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(404).json({
        data: null,
        error: { message: "User not found" },
      });
      return;
    }

    // Get all orders for the user
    const orders = await getOrdersForUser(userId);

    res.status(200).json({
      data: orders,
      error: null,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};
