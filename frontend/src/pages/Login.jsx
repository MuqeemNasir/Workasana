import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "react-toastify";
import AuthLayout from "../components/common/AuthLayout";
import PasswordInput from "../components/common/PasswordInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.warning("Please fill in all fields to login.");
    }

    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your workspace."
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Create Account"
    >
      <form onSubmit={handleSubmit} noValidate>
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
          {isLoading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
