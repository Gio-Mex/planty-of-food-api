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
router.get("/:orderID", getOrder); //get order by ID
router.get("/products/:product", getOrder); //get order by product
router.get("/date/:date", getOrder); //get order by date

router.post("/", createOrder);

router.put("/:orderID", updateOrder);

router.delete("/:orderID", deleteOrder);

export default router;
