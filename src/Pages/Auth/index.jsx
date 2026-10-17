
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../Store/authStore";
import Login from "./Login";
import Register from "./Register";

export default function Auth() {
  const [page, setPage] = useState("login");

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return page === "login" ? (
    <Login handlePage={setPage} />
  ) : (
    <Register handlePage={setPage} />
  );
}
