import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiGrid, FiUsers, FiShield, FiUserPlus, FiUserCheck,
  FiMapPin, FiBriefcase, FiLogOut, FiMenu, FiX,
} from "react-icons/fi";

function getNavLinks(adminData) {
  if (!adminData) return [];

  const { zone, formation } = adminData;
  const links = [];

  links.push({ to: "/dashboard", label: "Dashboard", icon: FiGrid });

  if (zone === "SHQ" && formation === "SHQ") {
    links.push(
      { to: "/dashboard/all-staff", label: "All Staff", icon: FiUsers },
      { to: "/dashboard/all-admins", label: "All Admins", icon: FiShield },
      { to: "/dashboard/register-staff", label: "Register Staff", icon: FiUserPlus },
      { to: "/dashboard/register-admin", label: "Register Admin", icon: FiUserCheck },
    );
  }

  if (zone && zone !== "SHQ" && zone === formation) {
    links.push({ to: "/dashboard/zonal-staff", label: `${zone} Staff`, icon: FiMapPin });
  }

  if (formation && formation !== "SHQ" && formation !== zone) {
    links.push({ to: "/dashboard/formation-staff", label: `${formation} Staff`, icon: FiBriefcase });
  }

  return links;
}

export default function SideBar() {
  const { adminData, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = getNavLinks(adminData);

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nis-secondary/10 flex items-center justify-center overflow-hidden">
            <img src="/src/assets/images/nis-logo.png" alt="NIS" className="w-8 h-8 object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-nis-primary truncate">
              {adminData?.email?.split("@")[0] || "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate capitalize">
              {adminData?.role?.toLowerCase() || "Administrator"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-nis-primary/10 text-nis-primary font-semibold"
                  : "text-gray-600 hover:bg-gray-100",
              ].join(" ")
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 w-full transition-colors cursor-pointer"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 text-nis-primary cursor-pointer"
      >
        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 h-screen",
          "fixed lg:sticky top-0 z-40",
          "transition-transform duration-300 lg:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {navContent}
      </aside>
    </>
  );
}
