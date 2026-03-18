import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import SearchBox from "../components/common/SearchBox";
import UserProfile from "../components/common/UserProfile";
import FilterTabs from "../components/common/FilterTabs";
import SortDropdown from "../components/common/SortDropdown";
import { FaArrowRight, FaCalendarAlt, FaPlus } from "react-icons/fa";
import {
  calculateDueDate,
  getBadgeClass,
  getInitials,
} from "../utils/formatters";
import CreateTaskModal from "../components/modals/CreateTaskModal";

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortType, setSortType] = useState("newest");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.data || []);
    } catch (error) {
      console.error("Tasks Fetch Error: ", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const processedTasks = tasks
    .filter((t) => {
      const searchMatch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.project?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const statusMatch = filterStatus === "All" || t.status === filterStatus;

      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortType === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortType === "a - z") return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div className="w-100">
          <h2 className="fw-bold text-dark mb-0">All Tasks</h2>
          <p className="text-muted small mb-0">
            Master list of all work across the organization.
          </p>
        </div>
        <div className="d-flex align-items-center gap-3 w-100 w-md-auto justify-content-md-end">
          <div className="w-100 w-md-auto">
            <SearchBox
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Tasks..."
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
            <span className="fw-semibold d-none d-sm-inline">New Tasks</span>
            <span className="fw-semibold d-sm-none">New</span>
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-5">
        <div className="table-responsive text-nowrap">
          <table
            className="table table-hover align-middle mb-0"
            style={{ minWidth: "100px" }}
          >
            <thead className="bg-light border-">
              <tr>
                <th
                  className="ps-4 py-3 text-secondary small"
                  style={{ width: "25%" }}
                >
                  TASKS
                </th>
                <th
                  className="text-secondary text-center small"
                  style={{ width: "20%" }}
                >
                  PROJECT
                </th>
                <th
                  className="text-secondary text-center small"
                  style={{ width: "15%" }}
                >
                  TEAM
                </th>
                <th className="text-secondary text-center small">ASSIGNEES</th>
                <th className="text-secondary text-center small">DUE DATE</th>
                <th className="text-secondary text-center small">STATUS</th>
                <th className="text-secondary text-center small">VIEW</th>
              </tr>
            </thead>
            <tbody>
              {processedTasks.map((task) => (
                <tr
                  key={task._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="transition-all hover-bg-light"
                >
                  <td className="ps-4 fw-bold text-dark py-3">{task.name}</td>
                  <td className="text-muted small fw-semibold">
                    {task.project?.name || (
                      <span className="text-black-50 fst-italic">
                        No Project
                      </span>
                    )}
                  </td>
                  <td className="text-muted small fw-semibold">
                    {task.team?.name || (
                      <span className="text-black-50 fst-italic">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="avatar-group">
                      {task.owners && task.owners.length > 0 ? (
                        task.owners.slice(0, 3).map((owner, index) => (
                          <div
                            key={owner._id}
                            className="avatar-circle shadow-sm"
                            style={{
                              backgroundColor: [
                                "#f59e0b",
                                "#10b981",
                                "#6366f1",
                                "#ec4899",
                                "#06b6d4",
                              ][index % 2],
                              border: "2px solid white",
                              width: "28px",
                              height: "28px",
                              fontSize: "10px",
                              marginLeft: index === 0 ? 0 : "-10px",
                            }}
                            title={owner.name}
                          >
                            {getInitials(owner.name)}
                          </div>
                        ))
                      ) : (
                        <span className="text-muted extra-small">
                          Unassigned
                        </span>
                      )}

                      {task.owners?.length > 3 && (
                        <div
                          className="bg-light text-secondary shadow-sm"
                          style={{
                            border: "2px solid white",
                            width: "28px",
                            height: "28px",
                            fontSize: "9px",
                            marginLeft: "-10px",
                          }}
                        >
                          <FaPlus />
                          {task.owners.length} - 3
                        </div>
                      )}
                    </div>
                  </td>

                  <td>
                    <div
                      className="d-flex align-items-center text-dark fw-bold gap-2"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <FaCalendarAlt size={12} className="text-muted" />
                      {calculateDueDate(task.createdAt, task.timeToComplete)}
                    </div>
                  </td>

                  <td className="text-center">
                    <span
                      className={`status-badge ${getBadgeClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="text-center text-primary pe-4">
                    <div
                      className="btn btn-sm btn-light rounded-circle p-2 d-flex align-items-center justify-content-center mx-auto"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <FaArrowRight size={12} />
                    </div>
                  </td>
                </tr>
              ))}

              {processedTasks.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5 text-muted bg-light"
                  >
                    No tasks found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onTaskCreated={fetchTasks}
        />
      )}
    </div>
  );
};

export default Tasks;
