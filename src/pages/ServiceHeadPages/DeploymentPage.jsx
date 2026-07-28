import { useEffect, useState } from "react";
import { FiSend, FiX, FiCheck, FiChevronDown } from "react-icons/fi";
import useAllStaffStore from "../../stores/shq-store/allStaffStore";
import LoadingSpinner from "../../components/spiner/LoadingSpinner";
import { ZONES, getRankLevel } from "../../selectors/staffStats";

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

export default function DeploymentPage() {
  const { allStaff, fetchAllStaff, updateStaff, loading } = useAllStaffStore();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [targetZone, setTargetZone] = useState("");
  const [targetFormation, setTargetFormation] = useState("");
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  const formationOptions = targetZone ? ZONE_FORMATIONS[targetZone] || [] : [];

  useEffect(() => {
    if (targetZone && targetFormation && !formationOptions.includes(targetFormation)) {
      setTargetFormation("");
    }
  }, [targetZone]);

  const filteredStaff = allStaff.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [s.surname, s.firstName, s.middleName, s.serviceNumber, s.rank, s.formation, s.zone]
      .some((v) => v && v.toLowerCase().includes(q));
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    const rankDiff = getRankLevel(b.rank) - getRankLevel(a.rank);
    if (rankDiff !== 0) return rankDiff;
    return a.serviceNumber.localeCompare(b.serviceNumber);
  });

  const allFilteredSelected = filteredStaff.length > 0 && selectedIds.size === filteredStaff.length;

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStaff.map((s) => s.id)));
    }
  }

  async function handlePost() {
    if (!targetZone || !targetFormation || selectedIds.size === 0) return;
    setPosting(true);
    setMessage(null);
    try {
      const updates = [];
      for (const id of selectedIds) {
        updates.push(updateStaff(id, { zone: targetZone, formation: targetFormation }));
      }
      await Promise.all(updates);
      await fetchAllStaff();
      setMessage({ type: "success", text: `${selectedIds.size} staff deployed to ${targetFormation} (${targetZone})` });
      setSelectedIds(new Set());
      setShowPostModal(false);
      setTargetZone("");
      setTargetFormation("");
    } catch {
      setMessage({ type: "error", text: "Failed to deploy staff. Please try again." });
    } finally {
      setPosting(false);
    }
  }

  const selectedStaff = allStaff.filter((s) => selectedIds.has(s.id));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-nis-primary">Staff Deployment</h1>
        {selectedIds.size > 0 && (
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nis-primary text-white text-sm font-medium hover:bg-nis-primary-light transition-colors cursor-pointer"
          >
            <FiSend size={16} />
            Post to Formation ({selectedIds.size})
          </button>
        )}
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? <FiCheck size={16} /> : <FiX size={16} />}
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-auto text-current opacity-60 hover:opacity-100 cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, service no, rank, formation..."
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
      />

      <div className="overflow-auto max-h-[calc(100vh-140px)] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-sm text-left bg-white dark:bg-gray-900">
          <thead className="sticky top-0 z-30 bg-white dark:bg-gray-900 text-nis-primary font-semibold">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-nis-primary focus:ring-nis-primary cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 whitespace-nowrap">S/N</th>
              <th className="px-4 py-3 whitespace-nowrap">Surname</th>
              <th className="px-4 py-3 whitespace-nowrap">First Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Service No</th>
              <th className="px-4 py-3 whitespace-nowrap">Rank</th>
              <th className="px-4 py-3 whitespace-nowrap">Current Formation</th>
              <th className="px-4 py-3 whitespace-nowrap">Zone</th>
              <th className="px-4 py-3 whitespace-nowrap">Gender</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center dark:text-white">
                  <LoadingSpinner size="lg" />
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 dark:text-white">
                  {allStaff.length === 0 ? "No staff records found." : "No records match your search."}
                </td>
              </tr>
            ) : (
              sortedStaff.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-2.5 dark:text-white">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-nis-primary focus:ring-nis-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-2.5 dark:text-white">{i + 1}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">{s.surname}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap dark:text-white">{s.firstName}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.serviceNumber}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.rank}</td>
                  <td className="px-4 py-2.5 dark:text-white">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-nis-secondary/10 text-nis-secondary text-xs font-medium">
                      {s.formation}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 dark:text-white">{s.zone}</td>
                  <td className="px-4 py-2.5 dark:text-white">{s.gender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPostModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => !posting && setShowPostModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => !posting && (setShowPostModal(false), setTargetFormation(""))}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
              disabled={posting}
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold text-nis-primary mb-1">Deploy Staff</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {selectedIds.size} staff selected for deployment
            </p>

            {selectedStaff.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                {selectedStaff.map((s) => (
                  <div key={s.id} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-nis-secondary shrink-0" />
                    {s.surname} {s.firstName} — {s.serviceNumber} ({s.formation})
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="targetZone" className="text-sm font-medium text-nis-primary">
                  Zone
                </label>
                <div className="relative">
                  <select
                    id="targetZone"
                    value={targetZone}
                    onChange={(e) => setTargetZone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm appearance-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary pr-10"
                  >
                    <option value="">Select zone...</option>
                    {ZONES.map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="targetFormation" className="text-sm font-medium text-nis-primary">
                  Formation
                </label>
                <div className="relative">
                  <select
                    id="targetFormation"
                    value={targetFormation}
                    onChange={(e) => setTargetFormation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm appearance-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary pr-10"
                  >
                    <option value="">
                      {targetZone ? "Select formation..." : "Select a zone first"}
                    </option>
                    {formationOptions.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => (setShowPostModal(false), setTargetZone(""), setTargetFormation(""))}
                disabled={posting}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePost}
                disabled={!targetZone || !targetFormation || posting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nis-primary text-white text-sm font-medium hover:bg-nis-primary-light transition-colors cursor-pointer disabled:opacity-50"
              >
                {posting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    Confirm Deployment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}