import { AppDataSource } from "../config/data-source";
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
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    console.log("Seeding users...");
    console.log("Clearing existing users...");
    await AppDataSource.query('TRUNCATE TABLE "user" CASCADE');

    console.log("Seeding users...");
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(users);

    console.log("Users seeded successfully.");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  }
};

seedUsers();
