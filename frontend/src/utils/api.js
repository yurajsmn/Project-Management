import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const cacheStore = new Map();
const CACHE_TTL_MS = 30_000;

const cachedGet = async (key, requestFn, ttl = CACHE_TTL_MS) => {
  const now = Date.now();
  const cached = cacheStore.get(key);
  if (cached && now - cached.timestamp < ttl) {
    return cached.response;
  }
  const response = await requestFn();
  cacheStore.set(key, { response, timestamp: now });
  return response;
};

const clearCacheByPrefix = (prefix) => {
  Array.from(cacheStore.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  });
};

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
  createProject: async (data) => {
    const res = await api.post("/projects", data);
    clearCacheByPrefix("projects:");
    return res;
  },
  getProjects: () => cachedGet("projects:all", () => api.get("/projects")),
  getMyProjects: () =>
    cachedGet("projects:mine", () => api.get("/projects/my-projects")),
  getProjectById: (id) =>
    cachedGet(`projects:${id}`, () => api.get(`/projects/${id}`)),
  addMember: (data) => api.post("/projects/add-member", data),
  getProjectStats: (projectId) =>
    cachedGet(`projects:${projectId}:stats`, () =>
      api.get(`/projects/${projectId}/stats`),
    ),
};

export const taskAPI = {
  createTask: async (data) => {
    const res = await api.post("/tasks", data);
    clearCacheByPrefix("tasks:");
    return res;
  },
  getTasksByProject: (projectId) =>
    cachedGet(`tasks:project:${projectId}`, () =>
      api.get(`/tasks/project/${projectId}`),
    ),
  getMyTasks: () => cachedGet("tasks:mine", () => api.get("/tasks/my-tasks")),
  getTaskById: (id) => cachedGet(`tasks:${id}`, () => api.get(`/tasks/${id}`)),
  updateTaskStatus: async (id, data) => {
    const res = await api.patch(`/tasks/${id}/status`, data);
    clearCacheByPrefix("tasks:");
    return res;
  },
  updateTask: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    clearCacheByPrefix("tasks:");
    return res;
  },
  deleteTask: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    clearCacheByPrefix("tasks:");
    return res;
  },
};

export default api;
