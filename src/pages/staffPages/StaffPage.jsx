import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStaffStore from "../../stores/staff-store/staffStore";
import LeaveApplicationForm from "../../components/leave/LeaveApplicationForm";
import LeaveApplicationList from "../../components/leave/LeaveApplicationList";
import IncidentReportForm from "../../components/incident/IncidentReportForm";
import MyIncidentReportList from "../../components/incident/MyIncidentReportList";
import Button from "../../components/buttons/Button";
import { FiLogOut, FiPlus, FiAlertTriangle } from "react-icons/fi";

export default function StaffPage() {
  const navigate = useNavigate();
  const { staffData, logout } = useStaffStore();
  const [showForm, setShowForm] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [incidentRefreshKey, setIncidentRefreshKey] = useState(0);

  if (!staffData) {
    navigate("/staff-login", { replace: true });
    return null;
  }

  const s = staffData;

  return (
    <div className="force-light min-h-screen bg-gray-50">
      <div className="sticky top-0 flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-14 py-2 ">
        <img
          src="src\assets\images\nis-logo.png"
          alt="nis logo "
          className="h-20 w-20"
        />
        <Button
          variant="ghost"
          leftIcon={<FiLogOut />}
          onClick={logout}
          className="text-gray-600 hover:text-nis-primary text-lg"
        >
          Logout
        </Button>
      </div>
      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex flex-col items-start gap-4">
          <h1 className="text-4xl font-bold text-nis-primary">
            {s.title} {s.surname} {s.firstName}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-lg text-gray-600 hidden sm:inline">
              {s.rank}
            </span>
            <span className="text-lg text-gray-600 hidden sm:inline">
              {s.serviceNumber}
            </span>
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-nis-primary">
                Incident Reporting
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Report security and migration issues within your locality
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FiAlertTriangle />}
              onClick={() => setShowIncidentForm(true)}
            >
              Report an Incident
            </Button>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-nis-primary">
              My Incident Reports
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Reports you have submitted and their current status
            </p>
          </div>
          <MyIncidentReportList
            officerId={s.authUid}
            refreshKey={incidentRefreshKey}
          />
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-nis-primary">
                My Leave Applications
              </h2>
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

        <details className="bg-white border border-gray-200 rounded-xl">
          <summary className="text-base font-semibold text-nis-primary p-4 md:p-5 cursor-pointer select-none">
            View Profile Details
          </summary>
          <div className="px-4 md:px-5 pb-5 space-y-4">
            {[
              {
                section: "Personal Information",
                fields: [
                  {
                    label: "Full Name",
                    value:
                      `${s.title} ${s.surname} ${s.firstName} ${s.middleName || ""}`.trim(),
                  },
                  { label: "Gender", value: s.gender },
                  { label: "Date of Birth", value: s.dateOfBirth },
                ],
              },
              {
                section: "Service Details",
                fields: [
                  { label: "Service Number", value: s.serviceNumber },
                  { label: "Rank", value: s.rank },
                  { label: "Formation", value: s.formation },
                  { label: "Zone", value: s.zone },
                  {
                    label: "Date of First Appointment",
                    value: s.dateOfFirstAppointment,
                  },
                ],
              },
              {
                section: "Contact",
                fields: [
                  { label: "Email", value: s.email },
                  { label: "Phone", value: s.phoneNumber },
                  { label: "Address", value: s.permanentAddress },
                ],
              },
              {
                section: "Origin",
                fields: [
                  { label: "State of Origin", value: s.stateOfOrigin },
                  { label: "LGA of Origin", value: s.lgaOfOrigin },
                ],
              },
              {
                section: "ID Numbers",
                fields: [
                  { label: "NIN", value: s.nin },
                  { label: "BVN", value: s.bvn },
                  { label: "NHF", value: s.nhf },
                ],
              },
            ].map((section) => (
              <fieldset
                key={section.section}
                className="border border-gray-200 rounded-xl p-5"
              >
                <legend className="text-base font-semibold text-nis-primary px-3 bg-white mx-2">
                  {section.section}
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.fields.map((f) =>
                    f.value ? (
                      <div key={f.label} className="space-y-0.5">
                        <p className="text-xs text-gray-400 uppercase">
                          {f.label}
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {f.value}
                        </p>
                      </div>
                    ) : null,
                  )}
                </div>
              </fieldset>
            ))}
          </div>
        </details>
      </main>

      {showIncidentForm && (
        <IncidentReportForm
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
          onClose={() => setShowIncidentForm(false)}
          onSuccess={() => {
            setShowIncidentForm(false);
            setIncidentRefreshKey((k) => k + 1);
          }}
        />
      )}

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
