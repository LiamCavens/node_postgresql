import { AppDataSource } from "../config/data-source";
import { Cart } from "../schemas/cart.entity";
import { CartItem } from "../schemas/cart-item.entity";
import { Product } from "../schemas/product.entity";
import { User } from "../schemas/user.entity";

const cartRepository = AppDataSource.getRepository(Cart);
const cartItemRepository = AppDataSource.getRepository(CartItem);
const productRepository = AppDataSource.getRepository(Product);
const userRepository = AppDataSource.getRepository(User);

// Get or Create a Cart for a User
export const getOrCreateCart = async (userId: string): Promise<Cart> => {
  let cart = await cartRepository.findOne({
    where: { userId, isDeleted: false },
    relations: ["items", "items.product"], // Ensure the cart items and products are loaded
  });

  if (!cart) {
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    cart = cartRepository.create({
      userId,
      items: [],
      isDeleted: false,
    });
    await cartRepository.save(cart);
  }

  return cart;
};

// Update a Cart with Product and Count
export const updateCart = async (
  userId: string,
  productId: string,
  count: number
): Promise<Cart | null> => {
  const cart = await getOrCreateCart(userId);
  const product = await productRepository.findOneBy({ id: productId });

  if (!product) {
    throw new Error(`Product with ID ${productId} not found.`);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.id === productId
  );

  if (itemIndex >= 0) {
    if (count === 0) {
      // Remove item from cart
      const cartItemToRemove = await cartItemRepository.findOne({
        where: { id: cart.items[itemIndex].id },
      });
      if (cartItemToRemove) {
        await cartItemRepository.remove(cartItemToRemove); // Remove from DB
        cart.items.splice(itemIndex, 1); // Remove from local cart
      }
    } else {
      // Update item count
      cart.items[itemIndex].count = count;
      await cartItemRepository.save(cart.items[itemIndex]); // Save the updated item
    }
  } else if (count > 0) {
    // Add a new item to the cart
    const newCartItem = cartItemRepository.create({
      product,
      count,
      cart,
    });
    cart.items.push(newCartItem); // Add to local cart
    await cartItemRepository.save(newCartItem); // Save to DB
  }

  return await cartRepository.save(cart); // Save and return the updated cart
};

// Clear a Cart
export const clearCart = async (userId: string): Promise<void> => {
  const cart = await getOrCreateCart(userId);

  if (cart.items.length > 0) {
    await cartItemRepository.remove(cart.items); // Remove all items in the cart
    cart.items = [];
    await cartRepository.save(cart); // Save the cart without items
  }
};
