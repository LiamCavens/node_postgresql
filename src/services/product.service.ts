import { Product } from "../schemas/product.entity";
import {
  getAllProducts as fetchAllProducts,
  getProductById as fetchProductById,
} from "../repositories/product.repository";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return await fetchAllProducts();
};

// Get a product by ID
export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  const product = await fetchProductById(productId);
  return product || null; // Return null if no product is found
};
