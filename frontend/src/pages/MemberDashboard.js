import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const MemberDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await taskAPI.getMyTasks();
      setTasks(res.data.tasks);
      setCurrentPage(1);
      const nextLinks = {};
      res.data.tasks.forEach((task) => {
        nextLinks[task._id] = task.submissionLink || "";
      });
      setSubmissionLinks(nextLinks);

      const statsData = {
        total: res.data.tasks.length,
        todo: res.data.tasks.filter((t) => t.status === "todo").length,
        inProgress: res.data.tasks.filter((t) => t.status === "in-progress")
          .length,
        done: res.data.tasks.filter((t) => t.status === "done").length,
      };
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, { status: newStatus });
      loadTasks();
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const handleSubmissionLinkChange = async (taskId, submissionLink) => {
    try {
      await taskAPI.updateTaskStatus(taskId, { submissionLink });
      loadTasks();
    } catch (err) {
      setError("Failed to update submission link");
    }
  };

  const handleSubmissionInputChange = (taskId, value) => {
    setSubmissionLinks((prev) => ({ ...prev, [taskId]: value }));
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
          <p className="text-gray-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-gray-600 text-sm mt-1">
              Track and manage your assigned work
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => {
                setError("");
                loadTasks();
              }}
              className="text-sm font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Tasks",
              value: stats.total,
              icon: "📋",
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "To Do",
              value: stats.todo,
              icon: "⭕",
              color: "from-gray-500 to-gray-600",
            },
            {
              label: "In Progress",
              value: stats.inProgress,
              icon: "⚙️",
              color: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Done",
              value: stats.done,
              icon: "✅",
              color: "from-green-500 to-green-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-xs font-semibold tracking-wide uppercase">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}
                >
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Your Assigned Tasks
          </h3>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 text-lg">No tasks assigned yet!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks
                .slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize,
                )
                .map((task) => (
                <div
                  key={task._id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">
                        {task.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {task.description}
                      </p>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateStatus(task._id, e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    >
                      <option value="todo">📌 To Do</option>
                      <option value="in-progress">⚙️ In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
                  </div>

                  {task.submissionLink && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        📎 Submission Link:
                      </p>
                      <a
                        href={task.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium break-all"
                      >
                        {task.submissionLink}
                      </a>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="text-sm text-gray-600 mb-2 block">
                      📎 Add/Update Submission Link:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={submissionLinks[task._id] || ""}
                        placeholder="https://..."
                        onChange={(e) =>
                          handleSubmissionInputChange(task._id, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleSubmissionLinkChange(
                            task._id,
                            submissionLinks[task._id],
                          )
                        }
                        disabled={
                          !submissionLinks[task._id] ||
                          submissionLinks[task._id] === task.submissionLink
                        }
                        className="btn-primary"
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === "done"
                            ? "bg-green-100 text-green-800"
                            : task.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status === "done"
                          ? "✅ Completed"
                          : task.status === "in-progress"
                            ? "⚙️ Working"
                            : "📌 Pending"}
                      </span>
                      <span className="text-sm text-gray-600">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className="btn-secondary"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {Math.max(1, Math.ceil(tasks.length / pageSize))}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(tasks.length / pageSize)),
                    )
                  }
                  className="btn-secondary"
                  disabled={currentPage >= Math.ceil(tasks.length / pageSize)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-around items-center py-3">
          {[
            {
              icon: "🏠",
              label: "Home",
              onClick: () => navigate("/dashboard"),
            },
            {
              icon: "📁",
              label: "Projects",
              onClick: () => navigate("/projects"),
            },
            { icon: "✓", label: "Tasks", active: true },
            { icon: "👤", label: "Me", onClick: () => {} },
          ].map((nav, i) => (
            <button
              key={i}
              onClick={nav.onClick}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                nav.active
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="text-xl">{nav.icon}</span>
              <span className="text-xs font-medium">{nav.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MemberDashboard;
