import { FiX, FiXCircle } from "react-icons/fi";
import Button from "../buttons/Button";
import { DeploymentTimeline } from "./DeploymentHistory";

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
      <span className="text-sm text-nis-primary font-medium">{value || "-"}</span>
    </div>
  );
}

export default function StaffDetailsDialog({ staff, onClose }) {
  if (!staff) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          <FiXCircle size={20} />
        </button>

        <h2 className="text-xl font-bold text-nis-primary mb-6">
          Staff Details
        </h2>

        <div className="space-y-5">
          <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <legend className="text-sm font-semibold text-nis-primary px-2">
              Personal Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <Field
                label="Full Name"
                value={`${staff.title || ""} ${staff.surname || ""} ${staff.firstName || ""} ${staff.middleName || ""}`.trim()}
              />
              <Field label="Gender" value={staff.gender} />
              <Field label="Date of Birth" value={staff.dateOfBirth} />
            </div>
          </fieldset>

          <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <legend className="text-sm font-semibold text-nis-primary px-2">
              Service Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <Field label="Service Number" value={staff.serviceNumber} />
              <Field label="Rank" value={staff.rank} />
              <Field label="Current Formation" value={staff.formation} />
              <Field label="Zone" value={staff.zone} />
              <Field
                label="Date of First Appointment"
                value={staff.dateOfFirstAppointment}
              />
            </div>
          </fieldset>

          <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <legend className="text-sm font-semibold text-nis-primary px-2">
              Contact
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <Field label="Email" value={staff.email} />
              <Field label="Phone" value={staff.phoneNumber} />
              <Field label="Address" value={staff.permanentAddress} />
            </div>
          </fieldset>

          <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <legend className="text-sm font-semibold text-nis-primary px-2">
              Deployment History
            </legend>
            <div className="mt-2">
              <DeploymentTimeline history={staff.deploymentHistory} />
            </div>
          </fieldset>

          <div className="flex justify-end">
            <Button variant="ghost" leftIcon={<FiX />} onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
