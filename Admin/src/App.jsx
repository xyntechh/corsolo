import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import DashboardContent from "./Pages/DashboardContent";
import AdminMainDashboard from "./Pages/AdminMainDashboard";
import AdminLogin from "./Pages/AdminLogin";
import { Toaster } from "react-hot-toast";
import UserDetailPage from "./Pages/UserDetailPage ";
import User from "./Pages/User";
import Partner from "./Pages/Partner";
import PartnerDetailsPage from "./Pages/PartnerDetailsPage ";
import SignupUsersList from "./Components/SignupUsersList";
import SignupUserDetails from "./Components/SignupUserDetails";
import Payment from "./Pages/Payment ";
import Ebook from "./Pages/Ebook";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminMainDashboard />}>
        <Route index element={<DashboardContent />} />
        <Route path="userDetails" element={<UserDetailPage />} />
        <Route path="user" element={<User />} />
        <Route path="partner" element={<Partner />} />
        <Route path="partnerDetails" element={<PartnerDetailsPage />} />
        <Route path="signUpUserlist" element={<SignupUsersList />} />
        <Route path="signUpUserDetails" element={<SignupUserDetails />} />
        <Route path="payment" element={<Payment />} />
        <Route path="eBook" element={<Ebook />} />
      </Route>
    </Routes>
  );
}

export default App;
