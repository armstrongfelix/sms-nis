import { createBrowserRouter } from "react-router-dom";
import AdminLoginPage from "../pages/LoginPages/AdminLoginPage";
import RegistrationForm from "../components/forms/RegistrationForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
]);

export default router;