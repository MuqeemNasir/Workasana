import { Link } from "react-router-dom";

const AuthLayout = ({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <div className="auth-container min-vh-100 d-flex justify-content-center align-items-center px-3">
      <div className="auth-overlay"></div>
      <div
        className="card glass-card border-0 w-100 position-relative z-1"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 p-2 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              <span
                className="text-white fw-bold fs-4"
                style={{ lineHeight: 1 }}
              >
                W
              </span>
            </div>
            <h3 className="fw-bold text-dark mb-1">{title}</h3>
            <p className="text-muted small">{subtitle}</p>
          </div>

          {children}
          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              {footerText}{" "}
              <Link
                to={footerLink}
                className="text-primary text-decoration-none fw-bold"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
