import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { AppDataSource } from "../config/data-source";
import { User } from "../schemas/user.entity";

dotenv.config(); // Load environment variables

// Users to Seed
const users = [
  {
    id: uuidv4(),
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123", // This should be hashed in a real application
  },
  {
    id: uuidv4(),
    name: "Jane Doe",
    email: "jane.doe@example.com",
    password: "password1234", // This should be hashed in a real application
  },
  {
    id: uuidv4(),
    name: "Alice Smith",
    email: "alice.smith@example.com",
    password: "password1235", // This should be hashed in a real application
  },
  {
    id: uuidv4(),
    name: "Robert Brown",
    email: "robert.brown@example.com",
    password: "securePassword123", // This should be hashed in a real application
  },
  {
    id: uuidv4(),
    name: "Lisa Adams",
    email: "lisa.adams@example.com",
    password: "mySecretPass456", // This should be hashed in a real application
  },
  {
    id: uuidv4(),
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    password: "pa$$w0rd2023", // This should be hashed in a real application
  },
];

const seedUsers = async () => {
  try {
    // Initialize the Data Source
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const userRepository = AppDataSource.getRepository(User);

    // Clear Existing Users
    await userRepository.clear(); // Deletes all records from the `User` table
    console.log("Existing users cleared");

    // Insert Users
    const userEntities = userRepository.create(users); // Create user entities
    const savedUsers = await userRepository.save(userEntities); // Save the entities
    console.log("Users seeded successfully:", savedUsers);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    // Destroy the Data Source
    await AppDataSource.destroy();
  }
};

// Run the Seeder
seedUsers();
