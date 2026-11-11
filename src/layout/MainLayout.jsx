
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const { isAuthentication, isLoading } = useSelector(state => state.auth);


  if (isLoading) return <h1>Loading...</h1>


  if (!isAuthentication) return <Navigate to={"/login"} />






  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#15141d] text-[#eee9f8]">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar onMenu={() => setSidebarOpen(true)} />

        {/* Scrollable Page */}
        <main className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <Outlet />
        </main>
      </div>
    </div>
  );
}