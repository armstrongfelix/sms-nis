import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStaffStore from "../../stores/staff-store/staffStore";
import Button from "../../components/buttons/Button";
import {
  FiHash, FiLock, FiAlertCircle, FiArrowLeft,
} from "react-icons/fi";

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, login } = useStaffStore();

  async function handleLogin(e) {
    e.preventDefault();
    const result = await login(serviceNumber, password);
    if (result) {
      navigate("/staff-dashboard", { replace: true });
    }
  }

  return (
    <div className="force-light min-h-screen bg-gradient-to-br from-nis-primary to-nis-primary-light flex items-center justify-center p-6">
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
