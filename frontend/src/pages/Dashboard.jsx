import { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import api from "../services/api";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import ProjectCard from "../components/cards/ProjectCard";
import TaskCard from "../components/cards/TaskCards";
import FilterDropdown from "../components/common/FilterDropdown";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import SearchBox from "../components/common/SearchBox";
import UserProfile from "../components/common/UserProfile";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 3;

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate()

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("")
  const [projectFilter, setProjectFilter] = useState("All");
  const [projectPage, setProjectPage] = useState(0);
  const [taskFilter, setTaskFilter] = useState("All");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchData = async () => {
    try {
      if (user) {
        const [taskRes, projectRes] = await Promise.all([
          api.get(`/tasks?owner=${user._id}`),
          api.get("/projects"),
        ]);

        setTasks(taskRes.data.data || []);
        setProjects(projectRes.data.data || []);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error: ", error);
      toast.error("Failed to load Dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = projectFilter === 'All' || p.status === projectFilter
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const displayedProjects = filteredProjects.slice(
    projectPage * ITEMS_PER_PAGE,
    (projectPage + 1) * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setProjectPage(0);
  }, [projectFilter, searchTerm]);

  const handlePrevPage = () => setProjectPage((p) => Math.max(0, p - 1));
  const handleNextPage = () =>
    setProjectPage((p) => Math.min(totalPages - 1, p + 1));

    const filteredTasks = tasks.filter((t) => {
      const matchesSearch = t.name.toLowerCase(searchTerm.toLowerCase()) || (t.project?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = taskFilter === 'All' || t.status === taskFilter
      return matchesSearch && matchesStatus
    })

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container-fluid px-2 px-md-4 py-4">
      {/* Desktop header */}
      <div className="d-none d-md-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-0">Dashboard</h2>
          <p className="text-muted small mb-0">
            Welcome back, <strong>{user?.name}</strong>!
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <SearchBox value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <UserProfile />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="d-md-none mb-4">
        <h3 className="fw-bold text-dark mb-1">
          Hello, {user?.name?.split(" ")[0]} 👋
        </h3>
        <p className="text-muted small">Here is what's happening today.</p>
        <SearchBox value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

        {/* =============== */}
        {/* Project Section */}
        {/* =============== */}

        {/* Desktop Toolbar */}
      <div className="d-none d-md-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-bold mb-0">Projects</h4>

          <FilterDropdown
            options={["To Do", "In Progress", "Completed"]}
            selected={projectFilter}
            onSelect={setProjectFilter}
          />
        </div>

        <button
          className="btn btn-primary btn-sm px-3 rounded-pill d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setShowProjectModal(true)}
        >
          <FaPlus size={12} /> New Project
        </button>
      </div>

      {/* Mobile Toolbar */}
      <div className="d-md-none mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex flex-row gap-3">
          <h4 className="fw-bold mb-0">Projects</h4>
          <FilterDropdown
            options={["To Do", "In Progress", "Completed"]}
            selected={projectFilter}
            onSelect={setProjectFilter}
          />
          </div>
          <button
            className="btn btn-primary btn-sm px-3 rounded-pill d-flex align-items-center justify-content gap-2 shadow-sm align-self-start"
            onClick={() => setShowProjectModal(true)}
          >
            <FaPlus size={10} /> <span className="fw-semibold">New</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="row g-3" style={{ minHeight: "200px" }}>
        {displayedProjects.map((project) => (
          <div className="col-12 col-md-6 col-xl-4" key={project._id} onClick={() => navigate(`/projects/${project._id}`)} style={{cursor: 'pointer'}}>
            <ProjectCard project={project} />
          </div>
        ))}

        {displayedProjects.length === 0 && (
          <div className="col-12 text-center text-muted py-5 border rounded bg-white">
            {projects.length === 0
              ? "No projects found."
              : "No projects match this filter."}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 mb-5">
          <div className="btn-group shadow-sm bg-white rounded-pill">
            <button
              className="btn btn-sm btn-white bg-white border-0 px-3 py-2 text-secondary"
              onClick={handlePrevPage}
              disabled={projectPage === 0}
              style={{ borderRadius: "20px 0 0 20px" }}
            >
              <FaChevronLeft size={10} />
            </button>
            <button
              className="btn btn-sm btn-white border-top-0 border-bottom-0 border-start border-end px-3 py-2 fw-bold text-dark disabled"
              style={{ backgroundColor: "#fff" }}
            >
              {projectPage + 1} / {totalPages}
            </button>
            <button
              className="btn btn-sm btn-white border-0 px-3 py-2 text-secondary"
              onClick={handleNextPage}
              disabled={projectPage >= totalPages - 1}
              style={{ borderRadius: "0 20px 20px 0" }}
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      )}

      {/* ============= */}
      {/* Tasks Section */}
      {/* ============= */}

      {/* Desktop Toolbar */}

      <div className="d-none d-md-flex justify-content-between align-items-center mb-3 mt-4">
        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-bold mb-0">My Tasks</h4>

          <FilterDropdown
            options={["To Do", "In Progress", "Completed", "Blocked"]}
            selected={taskFilter}
            onSelect={setTaskFilter}
          />
        </div>

        <button
          className="btn btn-primary btn-sm px-3 rounded-pill d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setShowTaskModal(true)}
        >
          <FaPlus size={12} /> New Task
        </button>
      </div>

      {/* Mobile Toolbar */}
      <div className="d-md-none mb-3 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex flex-row gap-3">
          <h4 className="fw-bold mb-0">My Tasks</h4>
          <FilterDropdown
            options={["To Do", "In Progress", "Completed", "Blocked"]}
            selected={taskFilter}
            onSelect={setTaskFilter}
          />
          </div>
          <button
            className="btn btn-primary btn-sm px-3 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm align-self-start"
            onClick={() => setShowTaskModal(true)}
          >
            <FaPlus size={10} /> <span className="fw-semibold">New</span>
          </button>
        </div>
      </div>

        {/* Tasks Grid */}
      <div className="row g-3">
        {filteredTasks.map((task) => (
          <div className="col-12 col-md-6 col-xl-4" key={task._id} onClick={() => navigate(`/projects/${task.project?._id || ''}`)} style={{cursor: 'pointer'}}>
            <TaskCard task={task} />
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="col-12 text-center py-5 text-muted bg-white rounded shadow-sm">
            {tasks.length === 0
              ? "You have no active tasks."
              : "No tasks match this filter."}
          </div>
        )}
      </div>

      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
          onProjectCreated={fetchData}
        />
      )}
      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={fetchData}
        />
      )}
    </div>
  );
};

export default Dashboard;
