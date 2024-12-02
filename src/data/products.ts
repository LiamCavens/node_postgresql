import { AppDataSource } from "../config/data-source";
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
    console.log("Initializing database connection...");
    await AppDataSource.initialize();

    console.log("Clearing existing products...");
    await AppDataSource.query('TRUNCATE TABLE "product" CASCADE');

    console.log("Seeding products...");
    const productRepository = AppDataSource.getRepository(Product);
    await productRepository.save(products);

    console.log("Products seeded successfully.");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  }
};

seedProducts();
