import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useShqLeaveStore from "../../stores/shq-store/shqLeaveStore";
import AdminLeaveDashboard from "../../components/leave/AdminLeaveDashboard";

export default function ServiceHeadLeaveApplications() {
  const { user, adminData } = useAuth();
  const { applications, loading, error, subscribe, cleanup, approveLeave, rejectLeave } =
    useShqLeaveStore();

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

  return (
    <AdminLeaveDashboard
      applications={applications}
      loading={loading}
      error={error}
      onApprove={handleApprove}
      onReject={handleReject}
      title="Leave Applications"
    />
  );
}
