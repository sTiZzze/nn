import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TaskList from "./components/TaskList";
import SignupForm from "./components/SignupForm";
import LogoutButton from "./components/LogoutButton";
import LoginForm from "./components/LoginForm";
import TaskDetail from "./components/TaskDetail";

function AppContent() {
  const { user, token } = useAuth();

  return (
    <Routes>
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/tasks/:id" element={<TaskDetail />} />
      <Route
        path="/tasks"
        element={token ? <TaskList /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/logout"
        element={
          <>
            <LogoutButton />
            <Navigate to="/signup" />
          </>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
