import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useFormationLeaveStore from "../../stores/formation-store/formationLeaveStore";
import AdminLeaveDashboard from "../../components/leave/AdminLeaveDashboard";

export default function FormationLeaveApplications() {
  const { user, adminData } = useAuth();
  const { applications, loading, error, subscribe, cleanup, approveLeave, rejectLeave } =
    useFormationLeaveStore();

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

  const formation = adminData?.formation || "";

  return (
    <AdminLeaveDashboard
      applications={applications}
      loading={loading}
      error={error}
      onApprove={handleApprove}
      onReject={handleReject}
      title={`${formation} - Leave Applications`}
    />
  );
}
