import express from "express";
import { User } from "./schemas/user.entity";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: User;
    }
  }
}