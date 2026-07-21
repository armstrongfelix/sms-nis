import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/SideBar";

export default function RootLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar />
      <main className="flex-1 overflow-auto lg:p-0 p-4 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
