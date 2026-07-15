// import { RouterProvider } from "react-router-dom";
// import router from "./router/mainRouter";

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import LoadingSpinner from "./components/spiner/LoadingSpinner";
import AllStaffDashboard from "./pages/ServiceHeadPages/AllStaffDashbord";

import React from "react";
import ZonalStaffDashboard from "./pages/ZonalHeadPages/ZonalStaffDashboard";
import RegistrationForm from "./components/forms/RegistrationForm";
import ZonalTest from "./components/ZonalTest";
import FormationStaffDashboard from "./pages/FormationHeadPage/FormationStaffDashboard";
import StaffLoginPage from "./pages/LoginPages/StaffLoginPage";

function App() {
  return (
    <div>
      {/* <AllStaffDashboard /> */}
      {/* <LoadingSpinner/> */}
      {/* <ZonalStaffDashboard /> */}
      {/* <RegistrationForm /> */}
      {/* <ZonalTest /> */}
      {/* <FormationStaffDashboard/> */}
      <StaffLoginPage/>
    </div>
  );
}

export default App;
