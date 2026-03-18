import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "react-toastify";
import AuthLayout from "../components/common/AuthLayout";
import PasswordInput from "../components/common/PasswordInput";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { signup, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.warning("Please fill in all fields.");
    }

    if (password.length < 8) {
      return toast.warning("Password must be at least 8 characters.");
    }

    const success = await signup(name, email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <AuthLayout
      title="Get Started"
      subtitle="Create your free account."
      footerText="Already have an Account?"
      footerLink="/login"
      footerLinkText="Login"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label fw-bold small text-secondary">
            Full Name
          </label>
          <input
            type="text"
            className="form-control form-control-lg bg-light border-0 fs-6"
            placeholder="Muqeem Nasir"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold small text-secondary">
            Email Address
          </label>
          <input
            type="email"
            className="form-control form-control-lg bg-light border-0 fs-6"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
        />
        <button
          type="submit"
          className="btn btn-primary w-100 btn-lg fw-bold shadow-sm"
          style={{
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            border: "none",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
