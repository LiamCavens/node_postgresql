import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { getUserProfile } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Get the authenticated user's profile
router.get("/profile", authenticate, asyncHandler(getUserProfile));

export default router;
