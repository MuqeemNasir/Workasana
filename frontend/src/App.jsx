import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import useAuthStore from "./stores/useAuthStore";
import { useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

import Projects from './pages/Projects';
import Team from './pages/Team';
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import TeamDetails from "./pages/TeamDetails";

// const Login = () => <h2 className='text-center mt-5'>Login Page</h2>
// const Signup = () => <h2 className="text-center mt-5">Signup Page</h2>;
// const Dashboard = () => {
//   const {logout, user} = useAuthStore()
//   return (
//     <div className="text-center mt-5">
//       <h1>Welcome, {user?.name}</h1>
//       <button className="btn btn-danger mt-3" onClick={logout}>Logout</button>
//     </div>
//   )
// };


const ProtectedRoute = ({children}) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}
// const NotFound = () => <h2 className="text-center mt-5">404 Not Found</h2>;

const ProtectedLayout = ({children}) => {
  return(
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route path="/projects" element={
          <ProtectedLayout>
            <Projects />
          </ProtectedLayout>
        } />
        <Route path="/projects/:id" element={
          <ProtectedLayout>
            <ProjectDetails/>
          </ProtectedLayout>
        } />
        <Route path="/tasks/:id" element={
          <ProtectedLayout>
            <TaskDetails/>
          </ProtectedLayout>
        } />
        <Route path="/teams" element={
          <ProtectedLayout>
            <Team />
          </ProtectedLayout>
        } />
        <Route path="/teams/:id" element={
          <ProtectedLayout>
            <TeamDetails />
          </ProtectedLayout>
        } />
        <Route path="/reports" element={
          <ProtectedLayout>
            <div className="text-center mt-5">Reports Page Coming Soon</div>
          </ProtectedLayout>
        } />
      </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
