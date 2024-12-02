import { AppDataSource } from "../config/data-source";
import logger from "../utils/logger";
import { User } from "../schemas/user.entity";
import bcrypt from "bcrypt";

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "admin",
  },
  {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    password: bcrypt.hashSync("password1234", 10),
    role: "user",
  },
  {
    name: "Alice Smith",
    email: "alice.smith@example.com",
    password: bcrypt.hashSync("password12345", 10),
    role: "user",
  },
];

const seedUsers = async () => {
  try {
    logger.info("Initializing database connection...");
    await AppDataSource.initialize();
    logger.info("Seeding users...");
    logger.info("Clearing existing users...");
    await AppDataSource.query('TRUNCATE TABLE "user" CASCADE');

    logger.info("Seeding users...");
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(users);

    logger.info("Users seeded successfully.");
  } catch (error) {
    logger.error("Error seeding users:", error);
  } finally {
    await AppDataSource.destroy();
    logger.info("Database connection closed.");
  }
};

seedUsers();
