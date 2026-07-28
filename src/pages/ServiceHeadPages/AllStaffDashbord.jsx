import { useEffect, useState } from "react";
import { FiEdit2, FiX } from "react-icons/fi";
import useAllStaffStore from "../../stores/shq-store/allStaffStore";
import LoadingSpinner from "../../components/spiner/LoadingSpinner";
import { RANKS, ZONES, getRankLevel } from "../../selectors/staffStats";
import ExportButtons from "../../components/export/ExportButtons";
import StaffDetailDialog from "../../components/dashboard/StaffDetailDialog";

const ZONE_FORMATIONS = {
  SHQ: ["SHQ", "FCSC"],
  ZONEA: ["ZONEA", "LASC", "OGSC", "SEBC"],
  ZONEB: ["ZONEB", "KDSC", "KNSC", "KOSC", "JISC", "SOSC", "ZASC", "KESC"],
  ZONEC: ["ZONEC", "BASC", "YOSC", "BOSC", "GOSC", "ADSC", "TASC", "IDBC"],
  ZONED: ["ZONED", "NISC", "KWSC", "KTSC", "FCSC"],
  ZONEE: ["ZONEE", "IMSC", "ABSC", "ENSC", "EBSC", "ANSC", "NITSOL", "NITSA", "NFBC"],
  ZONEF: ["ZONEF", "OYSC", "OSSC", "ONSC", "EKSC"],
  ZONEG: ["ZONEG", "EDSC", "DESC", "BYSC", "RISC", "AKSC", "CRSC", "MMIA", "RVMC"],
  ZONEH: ["ZONEH", "BESC", "PLSC", "NASC", "NAIA"],
};

const FIELDS = [
  { id: "title", label: "Title", type: "text" },
  { id: "surname", label: "Surname", type: "text" },
  { id: "firstName", label: "First Name", type: "text" },
  { id: "middleName", label: "Middle Name", type: "text" },
  { id: "gender", label: "Gender", type: "text" },
  { id: "dateOfBirth", label: "Date of Birth", type: "date" },
  { id: "serviceNumber", label: "Service Number", type: "text" },
  { id: "rank", label: "Rank", type: "text" },
  { id: "zone", label: "Zone", type: "text" },
  { id: "formation", label: "Formation", type: "text" },
  { id: "dateOfFirstAppointment", label: "Date of First Appt.", type: "date" },
  { id: "email", label: "Email", type: "email" },
  { id: "phoneNumber", label: "Phone", type: "text" },
  { id: "stateOfOrigin", label: "State of Origin", type: "text" },
  { id: "lgaOfOrigin", label: "LGA", type: "text" },
  { id: "nin", label: "NIN", type: "text" },
  { id: "bvn", label: "BVN", type: "text" },
  { id: "nhf", label: "NHF", type: "text" },
  { id: "permanentAddress", label: "Address", type: "text" },
];

export default function AllStaffDashboard() {
  const { allStaff, fetchAllStaff, updateStaff, loading } = useAllStaffStore();
  const [editing, setEditing] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  function openEdit(staff) {
    setEditing(staff);
    setForm({ ...staff });
  }

  function closeEdit() {
    setEditing(null);
    setForm({});
  }

  function closeDetail() {
    setSelectedStaff(null);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    await updateStaff(editing.id, form);
    await fetchAllStaff();
    closeEdit();
  }

  function setValue(id, value) {
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  const filteredStaff = allStaff.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const fields = [
      s.surname, s.firstName, s.middleName,
      s.serviceNumber,
      s.rank,
      s.formation,
      s.zone,
      s.gender,
      s.phoneNumber,
      s.email,
      s.stateOfOrigin,
      s.lgaOfOrigin,
      s.dateOfBirth,
      s.dateOfFirstAppointment,
      s.nin,
      s.bvn,
      s.nhf,
      s.permanentAddress,
    ];
    return fields.some((v) => v && v.toLowerCase().includes(q));
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    const rankDiff = getRankLevel(b.rank) - getRankLevel(a.rank);
    if (rankDiff !== 0) return rankDiff;
    return a.serviceNumber.localeCompare(b.serviceNumber);
  });

  const selectedZone = form.zone;
  const formationOptions = selectedZone ? ZONE_FORMATIONS[selectedZone] || [] : [];

  useEffect(() => {
    if (selectedZone && form.formation && !formationOptions.includes(form.formation)) {
      setValue("formation", "");
    }
  }, [selectedZone]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-nis-primary">All Staff</h1>
        <ExportButtons data={allStaff} filename="all-staff" />
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, service no, rank, formation, etc..."
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
      />

      <div className="overflow-auto max-h-[calc(100vh-140px)] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-sm text-left bg-white dark:bg-gray-900">
          <thead className="sticky top-0 z-30 bg-white dark:bg-gray-900 text-nis-primary font-semibold">
            <tr>
              <th className="px-4 py-3 sticky left-0 top-0 z-20 bg-white dark:bg-gray-900 min-w-[50px]">S/N</th>
              <th className="px-4 py-3 w-10 sticky left-[50px] top-0 z-20 bg-white dark:bg-gray-900" />
              <th className="px-4 py-3 whitespace-nowrap sticky left-[90px] top-0 z-20 bg-white dark:bg-gray-900 min-w-[120px]">Surname</th>
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
                <td colSpan={20} className="px-4 py-12 text-center dark:text-white">
                  <LoadingSpinner size="lg" />
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td
                  colSpan={20}
                  className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 dark:text-white"
                >
                  {allStaff.length === 0
                    ? "No staff records found."
                    : "No records match your search."}
                </td>
              </tr>
            ) : (
              sortedStaff.map((s, i) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedStaff(s)}
                >
                  <td className="px-4 py-2.5 sticky left-0 z-20 bg-white dark:bg-gray-900 min-w-[50px] dark:text-white">{i + 1}</td>
                  <td className="px-4 py-2.5 sticky left-[50px] z-20 bg-white dark:bg-gray-900 dark:text-white">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(s); }}
                      className="hover:text-nis-tertiary text-nis-secondary active:text-nis-primary transition-colors"
                      title="Edit staff"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap sticky left-[90px] z-20 bg-white dark:bg-gray-900 min-w-[120px] dark:text-white">{s.surname}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">{s.firstName}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">{s.middleName}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.serviceNumber}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.rank}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.formation}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.zone}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.gender}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">
                    {s.phoneNumber}
                  </td>
                  <td className="px-4 py-2.5 dark:text-white">{s.email}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">
                    {s.stateOfOrigin}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">
                    {s.lgaOfOrigin}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">
                    {s.dateOfBirth}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">
                    {s.dateOfFirstAppointment}
                  </td>
                  <td className="px-4 py-2.5 dark:text-white">{s.nin}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.bvn}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.nhf}</td>
                  <td
                    className="px-4 py-2.5 max-w-xs truncate dark:text-white"
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
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEdit}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                    {f.id === "rank" ? (
                      <select
                        id={f.id}
                        value={form[f.id] || ""}
                        onChange={(e) => setValue(f.id, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary bg-white dark:bg-gray-800"
                      >
                        <option value="">Select rank</option>
                        {RANKS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : f.id === "zone" ? (
                      <select
                        id={f.id}
                        value={form[f.id] || ""}
                        onChange={(e) => setValue(f.id, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary bg-white dark:bg-gray-800"
                      >
                        <option value="">Select zone</option>
                        {ZONES.map((z) => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                    ) : f.id === "formation" ? (
                      <select
                        id={f.id}
                        value={form[f.id] || ""}
                        onChange={(e) => setValue(f.id, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary bg-white dark:bg-gray-800"
                      >
                        <option value="">
                          {selectedZone ? "Select formation" : "Select a zone first"}
                        </option>
                        {formationOptions.map((fm) => (
                          <option key={fm} value={fm}>{fm}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={f.id}
                        type={f.type}
                        value={form[f.id] || ""}
                        onChange={(e) => setValue(f.id, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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

      {selectedStaff && (
        <StaffDetailDialog staff={selectedStaff} onClose={closeDetail} />
      )}
    </div>
  );
}
