import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../spiner/LoadingSpinner";

export function DashboardRedirect() {
  const { adminData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminData) return;

    const { zone, formation } = adminData;

    if (zone === "SHQ" && formation === "SHQ") {
      navigate("/dashboard/all-staff", { replace: true });
    } else if (zone === formation) {
      navigate("/dashboard/zonal-staff", { replace: true });
    } else {
      navigate("/dashboard/formation-staff", { replace: true });
    }
  }, [adminData, navigate]);

  return <LoadingSpinner />;
}

export default function ProtectedRoute() {
  const { user, adminData, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/admin-login" replace />;
  if (!adminData) return <Navigate to="/" replace />;

  return <Outlet />;
}
