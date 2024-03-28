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
router.get("/:productID", getProduct); //get product by productID

router.post("/", createProduct);

router.put("/:productID", updateProduct);

router.delete("/:productID", deleteProduct);

export default router;
