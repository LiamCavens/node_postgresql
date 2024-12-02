import { Request, Response } from "express";
import logger from "../utils/logger";
import { AppDataSource } from "../config/data-source";
import { Product } from "../schemas/product.entity";

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find(); // Fetch all products
    res.status(200).json({ data: products, error: null });
  } catch (error) {
    logger.error("Error fetching products:", error);
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
    logger.error("Error fetching product:", error);
    res
      .status(500)
      .json({ data: null, error: { message: "Internal server error" } });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price } = req.body;

    // Validate input
    if (!title || !description || typeof price !== "number") {
      res.status(400).json({
        data: null,
        error: { message: "Invalid input data" },
      });
      return;
    }

    const productRepository = AppDataSource.getRepository(Product);

    // Create a new product
    const newProduct = productRepository.create({
      title,
      description,
      price,
    });

    // Save the product to the database
    const savedProduct = await productRepository.save(newProduct);

    res.status(201).json({
      data: savedProduct,
      error: null,
    });
  } catch (error) {
    logger.error("Error creating product:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
};
