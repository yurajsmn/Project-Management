import express from "express";
import { body } from "express-validator";
import {
  createProject,
  getAllProjects,
  getProjectById,
  addMemberToProject,
  getMyProjects,
  getProjectStats,
} from "../controllers/projectController.js";
import { verifyToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Create project (admin only)
router.post(
  "/",
  verifyToken,
  authorizeRole(["admin"]),
  [
    body("title").trim().notEmpty().withMessage("Project title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Project description is required"),
  ],
  createProject,
);

// Get all projects
router.get("/", verifyToken, getAllProjects);

// Get my projects
router.get("/my-projects", verifyToken, getMyProjects);

// Get project by id
router.get("/:id", verifyToken, getProjectById);

// Add member to project
router.post(
  "/add-member",
  verifyToken,
  authorizeRole(["admin"]),
  [
    body("projectId").notEmpty().withMessage("Project ID is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
  ],
  addMemberToProject,
);

// Get project stats
router.get("/:projectId/stats", verifyToken, getProjectStats);

export default router;
