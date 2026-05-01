import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { projectAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [creating, setCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const loadProjects = useCallback(async () => {
    try {
      const res =
        user?.role === "admin"
          ? await projectAPI.getProjects()
          : await projectAPI.getMyProjects();
      setProjects(res.data.projects || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await projectAPI.createProject(formData);
      setFormData({ title: "", description: "" });
      setShowCreateProject(false);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-7 h-7 text-blue-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-8">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {user?.role === "admin" ? "All Projects" : "My Projects"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Browse and manage project portfolios.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => {
                setError("");
                loadProjects();
              }}
              className="text-sm font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {user?.role === "admin" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Create New Project
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add a new project and invite members.
                </p>
              </div>
              <button
                onClick={() => setShowCreateProject((prev) => !prev)}
                className="btn-primary"
              >
                {showCreateProject ? "Close" : "+ New Project"}
              </button>
            </div>

            {showCreateProject && (
              <form onSubmit={handleCreateProject} className="mt-6 space-y-4">
                <div>
                  <label className="form-label">Project Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="form-input resize-none"
                    placeholder="Describe the project goals..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn-success"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Project"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowCreateProject(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-600">No projects available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description?.substring(0, 80)}
                          {project.description &&
                          project.description.length > 80
                            ? "..."
                            : ""}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {project.createdBy?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{project.createdBy?.name || "Unknown"}</span>
                      </div>
                      <span>{project.members?.length || 0} members</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="btn-secondary"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of{" "}
                {Math.max(1, Math.ceil(projects.length / pageSize))}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(projects.length / pageSize)),
                  )
                }
                className="btn-secondary"
                disabled={currentPage >= Math.ceil(projects.length / pageSize)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
