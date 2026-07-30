import { useState } from "react";
import useStaffStore from "../../stores/staff-store/staffStore";
import LeaveApplicationForm from "../../components/leave/LeaveApplicationForm";
import LeaveApplicationList from "../../components/leave/LeaveApplicationList";
import Button from "../../components/buttons/Button";
import { FiLogOut, FiPlus } from "react-icons/fi";

export default function StaffPage() {
  const { staffData, logout } = useStaffStore();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!staffData) return null;

  const s = staffData;

  return (
    <div className="force-light min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-nis-primary">
          {s.title} {s.surname} {s.firstName}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:inline">{s.rank}</span>
          <span className="text-xs text-gray-400 hidden sm:inline">{s.serviceNumber}</span>
          <Button variant="ghost" leftIcon={<FiLogOut />} onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-nis-primary">My Leave Applications</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                View and track your leave requests
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FiPlus />}
              onClick={() => setShowForm(true)}
            >
              Apply for Leave
            </Button>
          </div>
        </section>

        <LeaveApplicationList officerId={s.authUid} key={refreshKey} />
      </main>

      {showForm && (
        <LeaveApplicationForm
          officerId={s.authUid}
          profile={{
            surname: s.surname,
            firstName: s.firstName,
            middleName: s.middleName,
            serviceNumber: s.serviceNumber,
            rank: s.rank,
            email: s.email,
            zone: s.zone,
            formation: s.formation,
          }}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
