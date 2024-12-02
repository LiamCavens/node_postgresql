import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

// User registration route
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));

export default router;
