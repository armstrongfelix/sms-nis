import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiGrid, FiUsers, FiShield, FiUserPlus, FiUserCheck,
  FiMapPin, FiBriefcase, FiBarChart2, FiLogOut, FiMenu, FiX, FiSend,
  FiSun, FiMoon, FiMonitor, FiCalendar, FiAlertTriangle,
} from "react-icons/fi";
import nisLogo from "../../assets/images/nis-logo.png";

function getNavSections(adminData) {
  if (!adminData) return [];

  const { zone, formation } = adminData;
  const sections = [];

  const overview = [
    { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  ];

  if (zone === "SHQ" && formation === "SHQ") {
    sections.push(
      {
        label: "Overview",
        links: [
          ...overview,
          { to: "/dashboard/analytics", label: "Analytics", icon: FiBarChart2 },
        ],
      },
      {
        label: "Staff Management",
        links: [
          { to: "/dashboard/all-staff", label: "All Staff", icon: FiUsers },
          { to: "/dashboard/register-staff", label: "Register Staff", icon: FiUserPlus },
        ],
      },
      {
        label: "Administration",
        links: [
          { to: "/dashboard/all-admins", label: "All Admins", icon: FiShield },
          { to: "/dashboard/register-admin", label: "Register Admin", icon: FiUserCheck },
        ],
      },
      {
        label: "Operations",
        links: [
          { to: "/dashboard/deployment", label: "Deployment", icon: FiSend },
          { to: "/dashboard/leave", label: "Leave Applications", icon: FiCalendar },
          { to: "/dashboard/incidents", label: "Incident Reports", icon: FiAlertTriangle },
        ],
      }
    );
  }

  if (zone && zone !== "SHQ" && zone === formation) {
    sections.push(
      {
        label: "Overview",
        links: [
          ...overview,
          { to: "/dashboard/zonal-analytics", label: "Analytics", icon: FiBarChart2 },
        ],
      },
      {
        label: "Staff Management",
        links: [
          { to: "/dashboard/zonal-staff", label: `${zone} Staff`, icon: FiMapPin },
        ],
      },
      {
        label: "Operations",
        links: [
          { to: "/dashboard/zonal-deployment", label: "Deployment", icon: FiSend },
          { to: "/dashboard/zonal-leave", label: "Leave Applications", icon: FiCalendar },
          { to: "/dashboard/incidents", label: "Incident Reports", icon: FiAlertTriangle },
        ],
      }
    );
  }

  if (formation && formation !== "SHQ" && formation !== zone) {
    sections.push(
      {
        label: "Overview",
        links: [
          ...overview,
          { to: "/dashboard/formation-analytics", label: "Analytics", icon: FiBarChart2 },
        ],
      },
      {
        label: "Staff Management",
        links: [
          { to: "/dashboard/formation-staff", label: `${formation} Staff`, icon: FiBriefcase },
        ],
      },
      {
        label: "Operations",
        links: [
          { to: "/dashboard/formation-leave", label: "Leave Applications", icon: FiCalendar },
          { to: "/dashboard/incidents", label: "Incident Reports", icon: FiAlertTriangle },
        ],
      }
    );
  }

  return sections;
}

export default function SideBar() {
  const { adminData, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navSections = getNavSections(adminData);

  const themeOptions = [
    { value: "light", label: "Light", icon: FiSun },
    { value: "dark", label: "Dark", icon: FiMoon },
    { value: "system", label: "System", icon: FiMonitor },
  ];

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nis-secondary/10 dark:bg-nis-secondary/20 flex items-center justify-center overflow-hidden">
            <img src={nisLogo} alt="NIS" className="w-8 h-8 object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-nis-primary truncate">
              {adminData?.email?.split("@")[0] || "Admin"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate capitalize">
              {adminData?.role?.toLowerCase() || "Administrator"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-4 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-nis-primary/10 dark:bg-nis-primary/20 text-nis-primary font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                    ].join(" ")
                  }
                >
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <p className="px-4 py-1 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Theme
        </p>
        <div className="flex gap-1">
          {themeOptions.map((opt) => {
            const active = theme === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                title={opt.label}
                className={[
                  "flex items-center justify-center flex-1 gap-1.5 px-2 py-2 rounded-lg text-xs transition-colors cursor-pointer",
                  active
                    ? "bg-nis-primary/10 dark:bg-nis-primary/20 text-nis-primary font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 w-full transition-colors cursor-pointer"
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-nis-primary cursor-pointer"
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
          "w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 h-screen",
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
