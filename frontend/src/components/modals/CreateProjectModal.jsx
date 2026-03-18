import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import ModalWrapper from "../common/ModalWrapper";

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.warning("Project name is required");

    setLoading(true);
    try {
      await api.post("/projects", { name, description });
      toast.success("Project created successfully.");
      onProjectCreated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper title="New Project" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="custom-label">Project Name</label>
          <input
            type="text"
            className="form-control custom-input"
            placeholder="e.g. Website Redesign"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="custom-label">Description</label>
          <textarea
            className="form-control custom-input"
            rows="3"
            placeholder="Briefly describe the project goals..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-5">
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#9ca3af",
              color: "white",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: "500",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn px-4"
            style={{
              backgroundColor: "#4f46ef",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: "500",
            }}
            disabled={loading}
          >
            {loading ? "..." : "Create"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default CreateProjectModal;
