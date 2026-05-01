import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { validationResult } from "express-validator";

export const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, projectId, assignedTo, deadline } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is the project creator
    if (project.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Only project creator can create tasks" });
    }

    // Check if assignedTo user is a project member
    if (!project.members.includes(assignedTo)) {
      return res
        .status(400)
        .json({ message: "User is not a member of this project" });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      deadline,
    });

    await task.save();
    await task.populate("assignedTo", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email")
      .populate("projectId", "title");

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.userId })
      .populate("assignedTo", "name email")
      .populate("projectId", "title description");

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, submissionLink } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this task" });
    }

    if (status) {
      task.status = status;
    }

    if (submissionLink) {
      task.submissionLink = submissionLink;
    }

    await task.save();
    await task.populate("assignedTo", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("projectId", "title description");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, assignedTo, deadline, status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is the project creator
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Only project creator can update tasks" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (deadline) task.deadline = deadline;
    if (status) task.status = status;

    await task.save();
    await task.populate("assignedTo", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is the project creator
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Only project creator can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
