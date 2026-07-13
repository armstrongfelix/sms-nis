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

function App() {
  return (
    <div>
      {/* <AllStaffDashboard /> */}
      {/* <LoadingSpinner/> */}
      <ZonalStaffDashboard />
      {/* <RegistrationForm /> */}
      {/* <ZonalTest /> */}
    </div>
  );
}

export default App;
