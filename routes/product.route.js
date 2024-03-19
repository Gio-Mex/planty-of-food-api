import { Router } from "express";
const router = Router();
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

router.get("/", getAllProducts);
router.get("/:name", getProduct); //get product by name

router.post("/", createProduct);

router.put("/:name", updateProduct);

router.delete("/:name", deleteProduct);

export default router;
