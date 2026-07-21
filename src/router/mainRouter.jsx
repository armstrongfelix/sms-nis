import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute, {
  DashboardRedirect,
} from "../components/layout/ProtectedRoute";
import RootLayout from "../components/layout/RootLayout";

import WelcomePage from "../pages/WelcomePage";
import AdminLoginPage from "../pages/LoginPages/AdminLoginPage";
import StaffLoginPage from "../pages/LoginPages/StaffLoginPage";
import AllStaffDashboard from "../pages/ServiceHeadPages/AllStaffDashbord";
import AllAdminsDashbord from "../pages/ServiceHeadPages/AllAdminsDashbord";
import ZonalStaffDashboard from "../pages/ZonalHeadPages/ZonalStaffDashboard";
import FormationStaffDashboard from "../pages/FormationHeadPage/FormationStaffDashboard";
import RegistrationForm from "../components/forms/RegistrationForm";
import AdminRegistrationForm from "../components/forms/AdminRegistrationForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/staff-login",
    element: <StaffLoginPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <DashboardRedirect /> },
          { path: "all-staff", element: <AllStaffDashboard /> },
          { path: "all-admins", element: <AllAdminsDashbord /> },
          { path: "zonal-staff", element: <ZonalStaffDashboard /> },
          { path: "formation-staff", element: <FormationStaffDashboard /> },
          { path: "register-staff", element: <RegistrationForm /> },
          { path: "register-admin", element: <AdminRegistrationForm /> },
        ],
      },
    ],
  },
]);

export default router;
