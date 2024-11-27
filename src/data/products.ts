import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { AppDataSource } from "../config/data-source";
import { Product } from "../schemas/product.entity";

dotenv.config(); // Load environment variables

// Products to Seed
const products = [
  {
    id: uuidv4(),
    title: "Book",
    description: "A very interesting book about TypeScript",
    price: 100,
  },
  {
    id: uuidv4(),
    title: "Laptop",
    description: "A powerful laptop for developers",
    price: 1500,
  },
  {
    id: uuidv4(),
    title: "Phone",
    description: "A smartphone with great camera features",
    price: 800,
  },
  {
    id: uuidv4(),
    title: "Gaming Console",
    description: "Next-gen gaming console for immersive gaming",
    price: 500,
  },
  {
    id: uuidv4(),
    title: "Smartwatch",
    description: "Fitness-focused smartwatch with multiple health sensors",
    price: 250,
  },
  {
    id: uuidv4(),
    title: "Noise-Canceling Headphones",
    description: "Premium headphones with excellent sound quality",
    price: 300,
  },
];

const seedProducts = async () => {
  try {
    // Initialize the Data Source
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const productRepository = AppDataSource.getRepository(Product);

    // Clear Existing Products
    await productRepository.clear(); // Deletes all records from the `Product` table
    console.log("Existing products cleared");

    // Insert Products
    const productEntities = productRepository.create(products);
    const savedProducts = await productRepository.save(productEntities);
    console.log("Products seeded successfully:", savedProducts);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    // Destroy the Data Source
    await AppDataSource.destroy();
  }
};

seedProducts();
