import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStaffStore from "../../stores/staff-store/staffStore";
import Button from "../../components/buttons/Button";
import { FiHash, FiLock, FiAlertCircle, FiLogOut, FiArrowLeft } from "react-icons/fi";

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");
  const { staffData, loading, error, login, logout } = useStaffStore();

  async function handleLogin(e) {
    e.preventDefault();
    const result = await login(serviceNumber, password);
    if (result) {
      setServiceNumber("");
      setPassword("");
    }
  }

  if (staffData) {
    const s = staffData;
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-nis-primary">
            {s.title} {s.surname} {s.firstName}
          </h1>
          <Button variant="ghost" leftIcon={<FiLogOut />} onClick={logout}>
            Logout
          </Button>
        </header>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          {[
            { section: "Personal Information", fields: [
              { label: "Full Name", value: `${s.title} ${s.surname} ${s.firstName} ${s.middleName || ""}`.trim() },
              { label: "Gender", value: s.gender },
              { label: "Date of Birth", value: s.dateOfBirth },
            ]},
            { section: "Service Details", fields: [
              { label: "Service Number", value: s.serviceNumber },
              { label: "Rank", value: s.rank },
              { label: "Formation", value: s.formation },
              { label: "Zone", value: s.zone },
              { label: "Date of First Appointment", value: s.dateOfFirstAppointment },
            ]},
            { section: "Contact", fields: [
              { label: "Email", value: s.email },
              { label: "Phone", value: s.phoneNumber },
              { label: "Address", value: s.permanentAddress },
            ]},
            { section: "Origin", fields: [
              { label: "State of Origin", value: s.stateOfOrigin },
              { label: "LGA of Origin", value: s.lgaOfOrigin },
            ]},
            { section: "ID Numbers", fields: [
              { label: "NIN", value: s.nin },
              { label: "BVN", value: s.bvn },
              { label: "NHF", value: s.nhf },
            ]},
          ].map((section) => (
            <fieldset key={section.section} className="bg-white border border-gray-200 rounded-xl p-5">
              <legend className="text-base font-semibold text-nis-primary px-3 bg-white mx-2">
                {section.section}
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.fields.map((f) => f.value ? (
                  <div key={f.label} className="space-y-0.5">
                    <p className="text-xs text-gray-400 uppercase">{f.label}</p>
                    <p className="text-sm font-medium text-gray-800">{f.value}</p>
                  </div>
                ) : null)}
              </div>
            </fieldset>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nis-primary to-nis-primary-light flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 max-w-md w-full">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-nis-primary transition-colors mb-8 cursor-pointer"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="w-25 h-25 bg-nis-secondary/5 rounded-full flex items-center justify-center mx-auto p-2 ">
          <img src="src/assets/images/nis-logo.png" alt="nis-logo" />
        </div>

        <div className="text-center space-y-2 mb-8 pt-10">
          <h1 className="text-xl font-bold text-nis-primary">Staff Login</h1>
          <p className="text-sm text-gray-500">Sign in with your service number</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              <FiAlertCircle className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="serviceNumber" className="text-sm font-medium text-nis-primary">
              Service Number
            </label>
            <div className="relative">
              <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="serviceNumber"
                type="text"
                placeholder="NIS00001"
                value={serviceNumber}
                onChange={(e) => setServiceNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-nis-primary">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="secondary" size="lg" className="w-full" loading={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
