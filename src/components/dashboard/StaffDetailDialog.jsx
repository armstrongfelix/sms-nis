import { FiX } from "react-icons/fi"
import { DeploymentTimeline } from "../deployment/DeploymentHistory"

const DETAIL_FIELDS = [
  { id: "title", label: "Title" },
  { id: "surname", label: "Surname" },
  { id: "firstName", label: "First Name" },
  { id: "middleName", label: "Middle Name" },
  { id: "gender", label: "Gender" },
  { id: "dateOfBirth", label: "Date of Birth" },
  { id: "serviceNumber", label: "Service Number" },
  { id: "rank", label: "Rank" },
  { id: "zone", label: "Zone" },
  { id: "formation", label: "Formation" },
  { id: "dateOfFirstAppointment", label: "Date of First Appt." },
  { id: "email", label: "Email" },
  { id: "phoneNumber", label: "Phone" },
  { id: "stateOfOrigin", label: "State of Origin" },
  { id: "lgaOfOrigin", label: "LGA" },
  { id: "nin", label: "NIN" },
  { id: "bvn", label: "BVN" },
  { id: "nhf", label: "NHF" },
  { id: "permanentAddress", label: "Address" },
]

export default function StaffDetailDialog({ staff, onClose }) {
  if (!staff) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-nis-primary mb-4">
          Staff Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DETAIL_FIELDS.map((f) => (
            <div key={f.id} className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {f.label}
              </span>
              <span className="text-sm text-nis-primary font-medium">
                {staff[f.id] || "-"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-nis-primary uppercase tracking-wide mb-3">
            Deployment History
          </h3>
          <DeploymentTimeline history={staff.deploymentHistory} />
        </div>
      </div>
    </div>
  )
}