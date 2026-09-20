import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar open={sidebarOpen} onCloseMenu={() => setSidebarOpen(false)} />

      <main className="min-h-screen pt-16 lg:pr-64 bg-gray-50">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </>
  );
}
