import { Order } from "../schemas/order.entity";
import { Cart } from "../schemas/cart.entity";
import { CartItem } from "../schemas/cart-item.entity";
import { Product } from "../schemas/product.entity";
import { AppDataSource } from "../config/data-source"; // TypeORM Data Source
import { createOrder as createOrderRepo } from "../repositories/order.repository";

const cartRepository = AppDataSource.getRepository(Cart);
const orderRepository = AppDataSource.getRepository(Order);
const cartItemRepository = AppDataSource.getRepository(CartItem);
const productRepository = AppDataSource.getRepository(Product);

export const createOrderFromCart = async (
  userId: string
): Promise<Order | null> => {
  // Fetch the cart for the user
  const cart = await cartRepository.findOne({
    where: { userId, isDeleted: false },
    relations: ["items", "items.product"], // Populate items and their associated products
  });

  // Check if the cart is empty
  if (!cart || cart.items.length === 0) {
    return null;
  }

  // Calculate the total price
  const total = cart.items.reduce((acc, item) => {
    const product = item.product;
    if (!product) {
      throw new Error(`Product with ID ${item.product.id} not found.`);
    }
    return acc + item.count * product.price;
  }, 0);

  // Map cart items to order items
  const orderItems = cart.items.map((item) => ({
    productId: item.product.id,
    count: item.count,
    price: item.product?.price, // Use product price for the order
  }));

  // Create a new order
  const order = orderRepository.create({
    userId,
    items: orderItems,
    total,
    status: "created",
  });

  // Save the order to the database
  const savedOrder = await orderRepository.save(order);

  // Clear the cart after the order is placed
  cart.items = [];
  await cartRepository.save(cart);

  return savedOrder;
};

export const getOrdersForUser = async (userId: string): Promise<Order[]> => {
  return await orderRepository.find({
    where: { userId },
    relations: ["items"], // Include order items in the result
  });
};
