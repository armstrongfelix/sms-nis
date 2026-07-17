import { useEffect, useState } from "react";
import { FiX, FiRefreshCw } from "react-icons/fi";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import useAllAdminStore from "../../stores/shq-store/allAdminStore";
import LoadingSpinner from "../../components/spiner/LoadingSpinner";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let password = "";
  for (let i = 0; i < 10; i++) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    password += chars[array[0] % chars.length];
  }
  return password;
}

export default function AllAdminsDashbord() {
  const { allAdmins, fetchAllAdmins, loading } = useAllAdminStore();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchAllAdmins();
  }, [fetchAllAdmins]);

  async function handleResetPassword() {
    setResetting(true);
    try {
      const password = generatePassword();
      await sendPasswordResetEmail(auth, selected.email);
      setNewPassword(password);
    } catch {
      setNewPassword("");
    } finally {
      setResetting(false);
    }
  }

  const filteredAdmins = allAdmins.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const fields = [a.zone, a.formation, a.role, a.email, a.id];
    return fields.some((v) => v && v.toLowerCase().includes(q));
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-nis-primary">All Admins</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by zone, formation, role, email..."
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
      />

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-nis-primary font-semibold">
            <tr>
              <th className="px-4 py-3">S/N</th>
              <th className="px-4 py-3 whitespace-nowrap">Zone</th>
              <th className="px-4 py-3 whitespace-nowrap">Formation</th>
              <th className="px-4 py-3 whitespace-nowrap">Role</th>
              <th className="px-4 py-3 whitespace-nowrap">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <LoadingSpinner size="lg" />
                </td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  {allAdmins.length === 0
                    ? "No admin records found."
                    : "No records match your search."}
                </td>
              </tr>
            ) : (
              filteredAdmins.map((a, i) => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2.5">{i + 1}</td>
                  <td className="px-4 py-2.5">{a.zone}</td>
                  <td className="px-4 py-2.5">{a.formation}</td>
                  <td className="px-4 py-2.5">{a.role}</td>
                  <td className="px-4 py-2.5">{a.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold text-nis-primary mb-5">
              Admin Details
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Zone
                </span>
                <p className="text-sm text-gray-800 mt-0.5">{selected.zone}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Formation
                </span>
                <p className="text-sm text-gray-800 mt-0.5">
                  {selected.formation}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Role
                </span>
                <p className="text-sm text-gray-800 mt-0.5">{selected.role}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Email
                </span>
                <p className="text-sm text-gray-800 mt-0.5">
                  {selected.email}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Admin ID
                </span>
                <p className="text-sm text-gray-500 mt-0.5 font-mono">
                  {selected.id}
                </p>
              </div>

              <hr className="border-gray-200" />

              <div className="text-center">
                <button
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  <FiRefreshCw size={16} className={resetting ? "animate-spin" : ""} />
                  {resetting ? "Resetting..." : "Reset Password"}
                </button>
              </div>

              {newPassword && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left space-y-2">
                  <p className="text-sm font-semibold text-yellow-800">
                    Password Reset
                  </p>
                  <p className="text-xs text-yellow-700">
                    A reset email has been sent to{" "}
                    <span className="font-semibold">{selected.email}</span>.
                  </p>
                  <p className="text-xs text-yellow-700">
                    New temporary password:{" "}
                    <span className="font-mono font-bold text-red-600 text-base">
                      {newPassword}
                    </span>
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Share this with the admin. They can also use the link sent
                    to their email to set their own password.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
