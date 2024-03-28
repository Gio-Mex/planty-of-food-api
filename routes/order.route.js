import { Router } from "express";
const router = Router();
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";

router.get("/", getAllOrders);
router.get("/:filter", getOrder); //get order by ID or product or date


router.post("/", createOrder);

router.put("/:orderID", updateOrder);

router.delete("/:orderID", deleteOrder);

export default router;
