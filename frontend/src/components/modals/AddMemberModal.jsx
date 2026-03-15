import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const AddMemberModal = ({ teamId, onClose, onMemberAdded }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users");
        setUsers(data || []);
      } catch (error) {
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return toast.warning("Please select a user");

    setLoading(true);
    try {
      await api.patch(`/teams/${teamId}/members`, { userId: selectedUser });
      toast.success("Member added!");
      onMemberAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "400px" }}
      >
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header border-0 pb-0 pt-3 px-4">
            <h6 className="modal-title fw-bold text-dark">Add New Member</h6>
            <button
              type="submit"
              className="btn-close"
              onClick={onClose}
              style={{ fontSize: "0.75rem" }}
            ></button>
          </div>

          <div className="modal-body px-4 pb-4 pt-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="form-label fw-semibold text-dark small mb-2"
                  style={{ fontSize: "0.8rem" }}
                >
                  Members Name
                </label>
                <select
                  className="form-select bg-white border py-2 text-muted"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  style={{ fontSize: "0.7rem" }}
                >
                  <option value="" disabled>
                    Select User
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-light text-muted fw-semibold"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
