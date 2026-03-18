import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const PasswordInput = ({
  value,
  onChange,
  label = "Password",
  placeholder = "********",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      {label && (
        <label className="form-label fw-bold small text-secondary">
          {label}
        </label>
      )}
      <div className="position-relative">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control form-control-lg bg-light border-0 fs-6 pe-5"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-muted"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex="-1"
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
