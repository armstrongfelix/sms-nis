import { useEffect, useState } from "react"
import { FiEdit2, FiX } from "react-icons/fi"
import useFormationStaffStore from "../../stores/formation-store/formationStaffStore"
import LoadingSpinner from "../../components/spiner/LoadingSpinner"

const FIELDS = [
  { id: "title", label: "Title", type: "text" },
  { id: "surname", label: "Surname", type: "text" },
  { id: "firstName", label: "First Name", type: "text" },
  { id: "middleName", label: "Middle Name", type: "text" },
  { id: "gender", label: "Gender", type: "text" },
  { id: "dateOfBirth", label: "Date of Birth", type: "date" },
  { id: "serviceNumber", label: "Service Number", type: "text" },
  { id: "rank", label: "Rank", type: "text" },
  { id: "formation", label: "Formation", type: "text" },
  { id: "zone", label: "Zone", type: "text" },
  { id: "dateOfFirstAppointment", label: "Date of First Appt.", type: "date" },
  { id: "email", label: "Email", type: "email" },
  { id: "phoneNumber", label: "Phone", type: "text" },
  { id: "stateOfOrigin", label: "State of Origin", type: "text" },
  { id: "lgaOfOrigin", label: "LGA", type: "text" },
  { id: "nin", label: "NIN", type: "text" },
  { id: "bvn", label: "BVN", type: "text" },
  { id: "nhf", label: "NHF", type: "text" },
  { id: "permanentAddress", label: "Address", type: "text" },
]

export default function FormationStaffDashboard() {
  const { allStaff, fetchAllStaff, updateStaff, loading } = useFormationStaffStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchAllStaff()
  }, [fetchAllStaff])

  function openEdit(staff) {
    setEditing(staff)
    setForm({ ...staff })
  }

  function closeEdit() {
    setEditing(null)
    setForm({})
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    await updateStaff(editing.id, form)
    await fetchAllStaff()
    closeEdit()
  }

  function setValue(id, value) {
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const filteredStaff = allStaff.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    const fields = [s.surname, s.firstName, s.middleName, s.serviceNumber, s.rank, s.formation, s.zone, s.gender, s.phoneNumber, s.email, s.stateOfOrigin, s.lgaOfOrigin, s.dateOfBirth, s.dateOfFirstAppointment, s.nin, s.bvn, s.nhf, s.permanentAddress]
    return fields.some((v) => v && v.toLowerCase().includes(q))
  })

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-nis-primary">Formation Staff</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, service no, rank, formation, etc..."
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
      />

      <div className="overflow-auto max-h-[calc(100vh-140px)] rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left bg-white">
          <thead className="sticky top-0 z-30 bg-white text-nis-primary font-semibold">
            <tr>
              <th className="px-4 py-3 sticky left-0 top-0 z-20 bg-white min-w-[50px]">S/N</th>
              <th className="px-4 py-3 w-10 sticky left-[50px] top-0 z-20 bg-white" />
              <th className="px-4 py-3 whitespace-nowrap sticky left-[90px] top-0 z-20 bg-white min-w-[120px]">Surname</th>
              <th className="px-4 py-3 whitespace-nowrap">First Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Middle Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Service No</th>
              <th className="px-4 py-3 whitespace-nowrap">Rank</th>
              <th className="px-4 py-3 whitespace-nowrap">Formation</th>
              <th className="px-4 py-3 whitespace-nowrap">Zone</th>
              <th className="px-4 py-3 whitespace-nowrap">Gender</th>
              <th className="px-4 py-3 whitespace-nowrap">Phone</th>
              <th className="px-4 py-3 whitespace-nowrap">Email</th>
              <th className="px-4 py-3 whitespace-nowrap">State of Origin</th>
              <th className="px-4 py-3 whitespace-nowrap">LGA</th>
              <th className="px-4 py-3 whitespace-nowrap">Date of Birth</th>
              <th className="px-4 py-3 whitespace-nowrap">
                Date of First Appt.
              </th>
              <th className="px-4 py-3 whitespace-nowrap">NIN</th>
              <th className="px-4 py-3 whitespace-nowrap">BVN</th>
              <th className="px-4 py-3 whitespace-nowrap">NHF</th>
              <th className="px-4 py-3 whitespace-nowrap">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={20} className="px-4 py-12 text-center">
                  <LoadingSpinner size="lg" />
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td
                  colSpan={20}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  {allStaff.length === 0
                    ? "No staff records found for your formation."
                    : "No records match your search."}
                </td>
              </tr>
            ) : (
              filteredStaff.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 sticky left-0 z-20 bg-white min-w-[50px]">{i + 1}</td>
                  <td className="px-4 py-2.5 sticky left-[50px] z-20 bg-white">
                    <button
                      onClick={() => openEdit(s)}
                      className="hover:text-nis-tertiary text-nis-secondary active:text-nis-primary transition-colors"
                      title="Edit staff"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap sticky left-[90px] z-20 bg-white min-w-[120px]">{s.surname}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{s.firstName}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{s.middleName}</td>
                  <td className="px-4 py-2.5">{s.serviceNumber}</td>
                  <td className="px-4 py-2.5">{s.rank}</td>
                  <td className="px-4 py-2.5">{s.formation}</td>
                  <td className="px-4 py-2.5">{s.zone}</td>
                  <td className="px-4 py-2.5">{s.gender}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {s.phoneNumber}
                  </td>
                  <td className="px-4 py-2.5">{s.email}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {s.stateOfOrigin}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {s.lgaOfOrigin}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {s.dateOfBirth}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {s.dateOfFirstAppointment}
                  </td>
                  <td className="px-4 py-2.5">{s.nin}</td>
                  <td className="px-4 py-2.5">{s.bvn}</td>
                  <td className="px-4 py-2.5">{s.nhf}</td>
                  <td
                    className="px-4 py-2.5 max-w-xs truncate"
                    title={s.permanentAddress}
                  >
                    {s.permanentAddress}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEdit}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold text-nis-primary mb-4">
              Edit Staff
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FIELDS.map((f) => (
                  <div key={f.id} className="flex flex-col gap-1">
                    <label
                      htmlFor={f.id}
                      className="text-sm font-medium text-nis-primary"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      value={form[f.id] || ""}
                      onChange={(e) => setValue(f.id, e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-nis-primary text-white text-sm hover:bg-nis-primary-light transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
