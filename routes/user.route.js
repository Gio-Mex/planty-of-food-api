import { Router } from "express";
const router = Router();
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

router.get("/", getAllUsers);
router.get("/:email", getUser); //get user by email

router.post("/", createUser);

router.put("/:email", updateUser);

router.delete("/:email", deleteUser);

export default router;
