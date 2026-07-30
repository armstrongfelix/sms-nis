import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useZonalLeaveStore from "../../stores/zonal-store/zonalLeaveStore";
import AdminLeaveDashboard from "../../components/leave/AdminLeaveDashboard";

export default function ZonalLeaveApplications() {
  const { user, adminData } = useAuth();
  const { applications, loading, error, subscribe, cleanup, approveLeave, rejectLeave } =
    useZonalLeaveStore();

  useEffect(() => {
    subscribe();
    return cleanup;
  }, []);

  async function handleApprove(leaveId) {
    await approveLeave(leaveId, user.uid, adminData?.email?.split("@")[0] || "Admin");
  }

  async function handleReject(leaveId, comment) {
    await rejectLeave(leaveId, user.uid, adminData?.email?.split("@")[0] || "Admin", comment);
  }

  const zone = adminData?.zone || "";

  return (
    <AdminLeaveDashboard
      applications={applications}
      loading={loading}
      error={error}
      onApprove={handleApprove}
      onReject={handleReject}
      title={`${zone} - Leave Applications`}
    />
  );
}
