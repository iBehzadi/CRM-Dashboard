import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="flex">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="pt-18 px-12 ">
        <Outlet />
      </main>
    </div>
  );
}
