import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses - auto-logout on token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const projectAPI = {
  createProject: (data) => api.post("/projects", data),
  getProjects: () => api.get("/projects"),
  getMyProjects: () => api.get("/projects/my-projects"),
  getProjectById: (id) => api.get(`/projects/${id}`),
  addMember: (data) => api.post("/projects/add-member", data),
  getProjectStats: (projectId) => api.get(`/projects/${projectId}/stats`),
};

export const taskAPI = {
  createTask: (data) => api.post("/tasks", data),
  getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  getMyTasks: () => api.get("/tasks/my-tasks"),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTaskStatus: (id, data) => api.patch(`/tasks/${id}/status`, data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;
