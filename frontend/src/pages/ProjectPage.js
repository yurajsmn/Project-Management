import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectAPI, taskAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");

  const loadProject = useCallback(async () => {
    try {
      const res = await projectAPI.getProjectById(projectId);
      setProject(res.data.project);

      const tasksRes = await taskAPI.getTasksByProject(projectId);
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember({ projectId, email: memberEmail });
      setMemberEmail("");
      setShowAddMember(false);
      loadProject();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  if (loading)
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
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );

  if (!project)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Project not found</p>
        </div>
      </div>
    );

  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-8">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
          <p className="text-gray-600 text-sm mt-1">{project.description}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Project Members
              </h3>
              <div className="space-y-3">
                {project.members && project.members.length > 0 ? (
                  project.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {member.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No members yet</p>
                )}
              </div>

              {user?.role === "admin" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {!showAddMember ? (
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="btn-primary w-full"
                    >
                      + Add Member
                    </button>
                  ) : (
                    <form onSubmit={handleAddMember} className="space-y-3">
                      <input
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Enter member email"
                        required
                        className="form-input"
                      />
                      <div className="flex gap-3">
                        <button type="submit" className="btn-success flex-1">
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddMember(false)}
                          className="btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Project Tasks
              </h3>
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No tasks in this project</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {task.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === "done"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          Assigned: {task.assignedTo?.name || "Unassigned"}
                        </span>
                        <span>
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Progress</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Completion Rate
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">
                    {tasks.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {completedTasks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-semibold text-yellow-600">
                    {tasks.length - completedTasks}
                  </span>
                </div>
              </div>

              {user?.role === "admin" && (
                <button
                  onClick={() => navigate(`/project/${projectId}/tasks`)}
                  className="btn-primary w-full mt-6"
                >
                  Manage Tasks
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
