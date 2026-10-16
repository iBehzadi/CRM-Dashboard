import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Navigate } from "react-router-dom";

export default function Auth() {
  const [page, setPage] = useState("login");

  const handlePageType = (pg) => {
    setPage(pg);
  };
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      {page === "login" ? (
        <Login handlePage={handlePageType} />
      ) : (
        <Register handlePage={handlePageType} />
      )}
    </>
  );
}
