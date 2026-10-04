import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/router";
import { Toaster } from "react-hot-toast";
import useLeadStore from "./Store/leadStore";

export default function App() {
  const fetchLeads = useLeadStore((state) => state.fetchLeads);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
