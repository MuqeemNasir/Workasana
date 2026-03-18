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
import Teams from './pages/Teams';
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import TeamDetails from "./pages/TeamDetails";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";

const ProtectedRoute = ({children}) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}

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
        <Route path="/tasks" element={
          <ProtectedLayout>
            <Tasks/>
          </ProtectedLayout>
        } />
        <Route path="/tasks/:id" element={
          <ProtectedLayout>
            <TaskDetails/>
          </ProtectedLayout>
        } />
        <Route path="/teams" element={
          <ProtectedLayout>
            <Teams />
          </ProtectedLayout>
        } />
        <Route path="/teams/:id" element={
          <ProtectedLayout>
            <TeamDetails />
          </ProtectedLayout>
        } />
        <Route path="/reports" element={
          <ProtectedLayout>
            <Reports />
          </ProtectedLayout>
        } />
        <Route path="/settings" element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        } />
      </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
