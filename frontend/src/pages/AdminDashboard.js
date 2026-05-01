import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectAPI, taskAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    dueTodayTasks: 0,
    completionRate: 0,
    projects: [],
    tasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSecondarySections, setShowSecondarySections] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    loadDashboardData(isMounted);
    const timer = setTimeout(() => {
      if (isMounted) {
        setShowSecondarySections(true);
      }
    }, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const loadDashboardData = async (isMounted = true) => {
    try {
      const projectsRes = await projectAPI.getProjects();
      const projects = projectsRes.data.projects;

      if (!projects || projects.length === 0) {
        if (isMounted) {
          setStats({
            totalProjects: 0,
            activeTasks: 0,
            dueTodayTasks: 0,
            completionRate: 0,
            projects: [],
            tasks: [],
          });
        }
        return;
      }
      const tasksResponses = await Promise.all(
        projects.map((project) => taskAPI.getTasksByProject(project._id)),
      );
      const allTasks = tasksResponses.flatMap((res) => res.data.tasks || []);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter((t) => t.status === "done").length;
      const dueTodayTasks = allTasks.filter(
        (t) =>
          new Date(t.deadline).toDateString() === today.toDateString() &&
          t.status !== "done",
      ).length;

      const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      if (isMounted) {
        setStats({
          totalProjects: projects.length,
          activeTasks: totalTasks,
          dueTodayTasks,
          completionRate,
          projects: projects.slice(0, 5),
          tasks: allTasks.filter((t) => t.status !== "done").slice(0, 5),
        });
      }
    } catch (err) {
      if (isMounted) {
        setError("Failed to load dashboard data");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
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
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Academic Overview
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Real-time tracking of institutional student projects and
              milestones.
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
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
                loadDashboardData();
              }}
              className="text-sm font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-xs font-semibold tracking-wide">
                  TOTAL PROJECTS
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {stats.totalProjects}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                  <path
                    fillRule="evenodd"
                    d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm11 1a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-green-600 text-sm font-semibold">
              ↑ 12% from last term
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-xs font-semibold tracking-wide">
                  ACTIVE TASKS
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.activeTasks}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M13 6a1 1 0 11-2 0 1 1 0 012 0zM9 8a1 1 0 11-2 0 1 1 0 012 0zM15 8a1 1 0 11-2 0 1 1 0 012 0zM12 12a1 1 0 11-2 0 1 1 0 012 0zM10 14a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {showSecondarySections ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Active Project Portfolio
                </h3>
                <button
                  onClick={() => navigate("/projects")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2"
                >
                  View All
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {stats.projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No projects yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Project Initiative
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Team Lead
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.projects.map((project) => (
                        <tr
                          key={project._id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/project/${project._id}`)}
                        >
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {project.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {project.description?.substring(0, 30)}...
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                                {project.createdBy?.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-gray-900 font-medium">
                                {project.createdBy?.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              ON TRACK
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Task Allocation
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Research", percent: 45, color: "bg-blue-600" },
                    { name: "Development", percent: 30, color: "bg-cyan-500" },
                    { name: "Documentation", percent: 25, color: "bg-purple-600" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          ></div>
                          <span className="text-gray-700 font-medium">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-gray-600 font-semibold">
                          {item.percent}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Urgent Milestones
                </h3>
                <div className="space-y-3">
                  {stats.tasks.slice(0, 3).map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <div className="bg-blue-600 text-white rounded-lg p-3 text-center min-w-fit">
                        <p className="text-xs text-blue-100">DUE</p>
                        <p className="text-lg font-bold">
                          {new Date(task.deadline).getDate()}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          {task.description?.substring(0, 40)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-around items-center py-3">
          {[
            {
              icon: "🏠",
              label: "Home",
              active: true,
              onClick: () => navigate("/dashboard"),
            },
            {
              icon: "📁",
              label: "Projects",
              active: false,
              onClick: () => navigate("/projects"),
            },
            {
              icon: "✓",
              label: "Tasks",
              active: false,
              onClick: () => navigate("/projects"),
            },
            {
              icon: "👤",
              label: "Me",
              active: false,
              onClick: () => navigate("/dashboard"),
            },
          ].map((nav, i) => (
            <button
              key={i}
              onClick={nav.onClick}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${nav.active ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
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

export default AdminDashboard;
