import React from "react";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { handleLogout } = useAuth();

  return <button onClick={handleLogout}>Выйти</button>;
};

export default LogoutButton;
