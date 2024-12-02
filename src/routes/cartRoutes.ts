import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  getCart,
  putCart,
  clearCartController,
  checkoutCart,
} from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/authRole.middleware";

const router = Router();

router.get("/",           authenticate, asyncHandler(getCart));
router.put("/",           authenticate, asyncHandler(putCart));
router.delete(
  "/:userId/cart",
  authenticate,
  authorizeAdmin,
  clearCartController
);
router.post("/checkout",  authenticate, asyncHandler(checkoutCart));

export default router;
