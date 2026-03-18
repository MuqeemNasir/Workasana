import { FaChartPie, FaCog, FaFolder, FaSignOutAlt, FaTasks, FaThLarge, FaTimes, FaUsers } from "react-icons/fa"
import useAuthStore from "../stores/useAuthStore"
import { NavLink } from "react-router-dom"

const Sidebar = ({isOpen, onClose}) => {
  const { logout } = useAuthStore()

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100">
      <div className="d-flex align-items-center justify-content-between mb-4 px-2 mt-2">
        <a href="/" className="d-flex align-items-center text-decoration-none">
          <div className="rounded-3 p-1 me-3 d-flex align-items-center justify-content-center bg-white shadow-sm" style={{width: 38, height: 38}}>
            <span className="fw-bold fs-5 text-primary">W</span>
          </div>
          <span className="fs-4 fw-bold text-white" style={{letterSpacing: '0.5px'}}>Workasana</span>
        </a>
        <button className="btn btn-sm text-white-50 d-md-none border-0" onClick={onClose}>
          <FaTimes size={20} />
        </button>
      </div>

      <div className="sidebar-divider"></div>

      <ul className="nav nav-pills flex-column mb-auto gap-1">
        <li>
          <NavLink to="/" className="sidebar-link" onClick={onClose}>
            <FaThLarge className="me-3" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className="sidebar-link" onClick={onClose}>
            <FaFolder className="me-3" /> Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className="sidebar-link" onClick={onClose}>
            <FaTasks className="me-3" /> Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to="/teams" className="sidebar-link" onClick={onClose}>
            <FaUsers className="me-3" /> Teams
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className="sidebar-link" onClick={onClose}>
            <FaChartPie className="me-3" /> Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="sidebar-link" onClick={onClose}>
            <FaCog className="me-3" /> Settings
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto pt-3 border-top" style={{borderColor: 'rgba(255, 255, 255, 0.1)'}}>
        <button onClick={logout} className="sidebar-link w-100 border-0 bg-transparent d-flex align-items-center justify-content-center p-2 rounded transition-all" style={{color: '#fca5a5', background: 'rgba(255, 0, 0, 0.1)'}}>
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>
    </div>
  )

  return(
    <>
      <div className="d-none d-md-flex flex-column p-3 position-fixed top-0 start-0 vh-100 sidebar-dark" style={{width: 'var(--sidebar-width)', zIndex: 1000}}>
        <SidebarContent />
      </div>

      {isOpen && (
        <div className="sidebar-overlay d-md-none" onClick={onClose}></div>
      )}

      <div className={`sidebar-mobile d-md-none p-3 sidebar-dark ${isOpen ? 'show' : ''}`}>
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar