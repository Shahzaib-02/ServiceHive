import express from "express";
import { signup, login, updateProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.patch("/profile", authenticateToken, updateProfile);

export default router;