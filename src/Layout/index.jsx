import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      {/* sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* content */}
      <main className="pt-18 px-12 ">
        <Outlet />
      </main>
    </div>
  );
}
