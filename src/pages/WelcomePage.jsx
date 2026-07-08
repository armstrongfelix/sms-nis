import Button from "../components/buttons/Button";
import { FiShield, FiUsers } from "react-icons/fi";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nis-primary to-nis-primary-light flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 max-w-lg w-full text-center space-y-8">
        <div className="space-y-2 gap-4">
          <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center mx-auto">
            <img src="src\assets\images\nis-logo.png" alt="nis-logo" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-nis-primary">
            Nigeria Immigration Service
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Staff Management System
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<FiUsers />}
            className="flex-1"
          >
            Login as Staff
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<FiShield />}
            className="flex-1"
          >
            Login as Admin
          </Button>
        </div>

        <p className="text-xs text-gray-400 pt-2">
          &copy; {new Date().getFullYear()} Nigeria Immigration Service. All
          rights reserved.
        </p>
      </div>
    </div>
  );
}
