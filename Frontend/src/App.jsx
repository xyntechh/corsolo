import { Route, Routes } from "react-router-dom";
import Input from "./Pages/Input";
import LookingFor from "./Pages/LookingFor";
import ProtectedRoute from "./Pages/ProtectedRoute";
import FindMatch from "./Pages/FindMatch";
import ReactGA from "react-ga4";
import usePageTracking from "./usePageTracking";
import CityChat from "./Components/CityChat";
import DatingAppHome from "./Pages/DatingAppHome";
import Login from "./Pages/Login";
import ContactUs from "./Pages/ContactUs";
import RefundPolicy from "./Pages/RefundPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import DefaultPage from "./Pages/DefaultPage";
import SignUp from "./Pages/SignUp";
import Partner from "./Pages/Partner";
import PartnerDashboardContent from "./Partner/Pages/PartnerDashboardContent.jsx";
import PartnerMainDashboard from "./Partner/Pages/PartnerMain.jsx";

import Payment from "./Partner/Pages/Payment";
import EbookPage from "./ExternalPages/EbookPage.jsx";
import CheckoutPage from "./ExternalPages/CheckoutPage.jsx";
import PaymentSuccess from "./ExternalPages/PaymentSuccess.jsx";
import ValentineShop from "./ExternalPages/ValentineShop.jsx";
import ValentineCheckout from "./ExternalPages/ValentineCheckout.jsx";
import ValentinePaymentSuccess from "./ExternalPages/ValentinePaymentSuccess.jsx";

ReactGA.initialize("G-Y2DP2Y0VW2"); // Yaha apni measurement ID daalna

//Vinay branch

function App() {
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<DefaultPage />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/guest" element={<Input />} />
      <Route path="/citychat/:city" element={<CityChat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/refundpolicy" element={<RefundPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/partner" element={<Partner />} />
      <Route path="/eBook" element={<EbookPage />} />
      <Route path="/checkOutPage" element={<CheckoutPage />} />
      <Route path="/paymentSuccessEbook" element={<PaymentSuccess />} />
      <Route path="/valantine" element={<ValentineShop />} />
      <Route path="/valantineCheckOut" element={<ValentineCheckout />} />
      <Route
        path="/valantinePaymentSuccess"
        element={<ValentinePaymentSuccess />}
      />

      <Route
        path="/looking-for"
        element={
          <ProtectedRoute>
            <LookingFor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <FindMatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <DatingAppHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/partner/dashboard"
        element={
          <ProtectedRoute>
            <PartnerMainDashboard />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedRoute>
              <PartnerDashboardContent />
            </ProtectedRoute>
          }
        />

        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
