import React from "react";
import RegisterUser from "./components/RegisterUser";
import UploadKYC from "./components/UploadKYC";
import CreateAccount from "./components/CreateAccount";
import AccountDetails from "./components/AccountDetails";
import { BrowserRouter as Router, Routes, Route}
from "react-router-dom";



function App() {
  return (
     <Router>
      <Routes>
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/uploadkyc" element={<UploadKYC />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/account" element={<AccountDetails />} />
        <Route path="/" element={<RegisterUser />} /> {/* default page */}
      </Routes>
    </Router>
  );
}

export default App;

