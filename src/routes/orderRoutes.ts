import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { createOrder, getOrders } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/",  authenticate, asyncHandler(createOrder));
router.get("/",   authenticate, asyncHandler(getOrders));

export default router;
