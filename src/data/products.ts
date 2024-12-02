import { AppDataSource } from "../config/data-source";
import logger from "../utils/logger";
import { Product } from "../schemas/product.entity";

const products = [
  { title: "Book", description: "A very interesting book", price: 100 },
  {
    title: "Laptop",
    description: "A powerful laptop for developers",
    price: 1500,
  },
  {
    title: "Phone",
    description: "A smartphone with great camera features",
    price: 800,
  },
];

const seedProducts = async () => {
  try {
    logger.info("Initializing database connection...");
    await AppDataSource.initialize();

    logger.info("Clearing existing products...");
    await AppDataSource.query('TRUNCATE TABLE "product" CASCADE');

    logger.info("Seeding products...");
    const productRepository = AppDataSource.getRepository(Product);
    await productRepository.save(products);

    logger.info("Products seeded successfully.");
  } catch (error) {
    logger.error("Error seeding products:", error);
  } finally {
    await AppDataSource.destroy();
    logger.info("Database connection closed.");
  }
};

seedProducts();
