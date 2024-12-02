import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../schemas/user.entity";
import { AppDataSource } from "../config/data-source";

const userRepository = AppDataSource.getRepository(User);

export const authenticateUser = async (
  email: string,
  password: string
): Promise<string | null> => {
  // Find user by email
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    throw new Error("No user with such email or password");
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("No user with such email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRY }
  );

  return token;
};
