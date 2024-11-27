import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../schemas/product.entity";

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find(); // Fetch all products
    res.status(200).json({ data: products, error: null });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ data: null, error: { message: "Internal server error" } });
  }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOneBy({ id: req.params.id }); // Find product by ID

    if (!product) {
      res
        .status(404)
        .json({ data: null, error: { message: "Product not found" } });
      return;
    }

    res.status(200).json({ data: product, error: null });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ data: null, error: { message: "Internal server error" } });
  }
};
