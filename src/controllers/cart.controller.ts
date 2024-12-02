import { Request, Response } from "express";
import {
  getOrCreateCart,
  updateCart,
  clearCart,
} from "../services/cart.service";
import { AppDataSource } from "../config/data-source";
import { User } from "../schemas/user.entity";
import { createOrderFromCart } from "../services/order.service";

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;

    // Ensure the user exists
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      user = userRepository.create({ id: userId, name: "Anonymous" });
      await userRepository.save(user);
    }

    const cart = await getOrCreateCart(userId);

    // Calculate the total price
    const total = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0
    );

    res.status(200).json({
      data: {
        cart: {
          id: cart.id,
          items: cart.items,
        },
        total,
      },
      error: null,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};

export const putCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { productId, count } = req.body;

    if (!userId) {
      res.status(401).json({
        data: null,
        error: { message: "Unauthorized: User ID is missing" },
      });
      return;
    }

    if (!productId || typeof count !== "number") {
      res.status(400).json({
        data: null,
        error: { message: "Invalid product ID or count" },
      });
      return;
    }

    const updatedCart = await updateCart(userId, productId, count);

    const total = updatedCart?.items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0
    );

    res.status(200).json({
      data: { cart: updatedCart, total },
      error: null,
    });
  } catch (error: any) {
    console.error("Error updating cart:", error.message);

    if (error.message.includes("Product with ID")) {
      res.status(404).json({
        data: null,
        error: { message: error.message },
      });
      return;
    }

    res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
};

export const clearCartController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        data: null,
        error: { message: "User ID is required" },
      });
      return;
    }

    await clearCart(userId);

    res.status(200).json({
      data: { message: "Cart cleared successfully" },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};

export const checkoutCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId as string;

    if (!userId) {
      res.status(401).json({
        data: null,
        error: { message: "Unauthorized: User ID is missing" },
      });
      return;
    }

    const cart = await getOrCreateCart(userId);

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        data: null,
        error: { message: "Cart is empty or invalid for checkout" },
      });
      return;
    }

    const order = await createOrderFromCart(userId);

    if (!order) {
      res.status(500).json({
        data: null,
        error: { message: "Failed to create order during checkout" },
      });
      return;
    }

    await clearCart(userId);

    res.status(201).json({
      data: {
        message: "Checkout successful",
        order,
      },
      error: null,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
};
