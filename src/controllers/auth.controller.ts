import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../schemas/user.entity";
import { hash } from "bcrypt";
import { authenticateUser } from "../services/auth.service";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input fields
    if (!email || !password) {
      res.status(400).json({
        data: null,
        error: { message: "Email and password are required" },
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        data: null,
        error: { message: "Email is not valid" },
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if the email already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        data: null,
        error: { message: "Email is already in use" },
      });
      return;
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user
    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role is "user"
    });

    const savedUser = await userRepository.save(newUser);

    // Respond with the created user
    res.status(201).json({
      data: {
        name: savedUser.name,
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      },
      error: null,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({
      data: null,
      error: { message: "Internal Server error" },
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      data: null,
      error: { message: "Email and password are required" },
    });
    return;
  }

  try {
    const token = await authenticateUser(email, password);

    res.status(200).json({
      data: { token },
      error: null,
    });
  } catch (error: any) {
    if (error.message === "No user with such email or password") {
      res.status(404).json({
        data: null,
        error: { message: error.message },
      });
    } else {
      res.status(500).json({
        data: null,
        error: { message: "Internal Server error" },
      });
    }
  }
};
