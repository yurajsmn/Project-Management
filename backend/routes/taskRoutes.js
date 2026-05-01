import express from "express";
import { body } from "express-validator";
import {
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTaskStatus,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Get my tasks (must come before /:id route)
router.get("/my-tasks", verifyToken, getMyTasks);

// Get tasks by project
router.get("/project/:projectId", verifyToken, getTasksByProject);

// Create task (admin only)
router.post(
  "/",
  verifyToken,
  authorizeRole(["admin"]),
  [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Task description is required"),
    body("projectId").notEmpty().withMessage("Project ID is required"),
    body("assignedTo").notEmpty().withMessage("Assigned user is required"),
    body("deadline").isISO8601().withMessage("Invalid deadline date"),
  ],
  createTask,
);

// Get task by id
router.get("/:id", verifyToken, getTaskById);

// Update task status (member can only update their own)
router.patch(
  "/:id/status",
  verifyToken,
  [
    body("status")
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Invalid status"),
    body("submissionLink")
      .optional()
      .isURL()
      .withMessage("Invalid submission link"),
  ],
  updateTaskStatus,
);

// Update task (admin only)
router.put(
  "/:id",
  verifyToken,
  authorizeRole(["admin"]),
  [
    body("title").optional().trim(),
    body("description").optional().trim(),
    body("assignedTo").optional(),
    body("deadline").optional().isISO8601(),
    body("status").optional().isIn(["todo", "in-progress", "done"]),
  ],
  updateTask,
);

// Delete task (admin only)
router.delete("/:id", verifyToken, authorizeRole(["admin"]), deleteTask);

export default router;
