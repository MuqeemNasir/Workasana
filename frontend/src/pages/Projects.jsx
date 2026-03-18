import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import SearchBox from "../components/common/SearchBox";
import UserProfile from "../components/common/UserProfile";
import FilterTabs from "../components/common/FilterTabs";
import SortDropdown from "../components/common/SortDropdown";
import { FaPlus } from "react-icons/fa";
import ProjectCard from "../components/cards/ProjectCard";
import CreateProjectModal from "../components/modals/CreateProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(6);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortType, setSortType] = useState("newest");

  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      setProjects(data.data || []);
    } catch (error) {
      console.error("Project Fetch Error: ", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setVisibleCount((prev) => prev + 3);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || p.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortType === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortType === "a-z") return a.name.localCompare(b.name);
      return 0;
    });

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  if (loading && projects.length === 0)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div className="w-100">
          <h2 className="fw-bold text-dark mb-0">Projects</h2>
          <p className="text-muted small mb-0">Overview of all workspaces</p>
        </div>
        <div className="d-flex align-items-center gap-3 w-100 w-md-auto justify-content-md-end">
          <div className="w-100 w-md-auto">
            <SearchBox
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-none d-md-block">
            <UserProfile />
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 bg-white p-3 rounded-3 shadow-sm border">
        <div
          className="overflow-auto pb-2 pb-md-0"
          style={{ whiteSpace: "nowrap" }}
        >
          <FilterTabs
            options={["In Progress", "Completed", "ToDo", "Blocked"]}
            selected={filterStatus}
            onSelect={setFilterStatus}
          />
        </div>

        <div className="d-flex align-items-center justify-content-between gap-3">
          <SortDropdown onSort={setSortType} />

          <button
            className="btn btn-primary btn-sm px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FaPlus size={11} />
            <span className="fw-semibold d-none d-sm-inline">New Project</span>
            <span className="fw-semibold d-sm-none">New</span>
          </button>
        </div>
      </div>

      <div className="row g-4 pb-5">
        {displayedProjects.map((project) => (
          <div className="col-12 col-md-6 col-xl-4" key={project._id}>
            <div
              onClick={() => navigate(`/projects/${project._id}`)}
              style={{ cursor: "pointer" }}
            >
              <ProjectCard project={project} />
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No Projects found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onProjectCreated={fetchProjects}
        />
      )}
    </div>
  );
};

export default Projects;
