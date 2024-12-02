import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { getProducts, getProductById, createProduct } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/",     authenticate, asyncHandler(getProducts));
router.get("/:id",  authenticate, asyncHandler(getProductById));
router.post("/",    authenticate, createProduct);

export default router;
