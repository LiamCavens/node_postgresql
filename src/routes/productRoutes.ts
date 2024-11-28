import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { getProducts, getProductById, createProduct } from "../controllers/product.controller";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.get("/:id", asyncHandler(getProductById));
router.post("/", createProduct);

export default router;
