import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  getServiceImage,
  updateService,
  deleteService,
  approveService,
  rejectService,
} from "../controllers/servicesController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes — image route must come before /:id
router.get("/", getServices);
router.get("/:id/images/:imageIndex", getServiceImage);
router.get("/:id", getServiceById);

// Protected routes (require authentication)
router.post("/", authenticateToken, createService);
router.put("/:id", authenticateToken, updateService);
router.delete("/:id", authenticateToken, deleteService);

// Admin routes
router.patch("/:id/approve", authenticateToken, approveService);
router.patch("/:id/reject", authenticateToken, rejectService);

export default router;
