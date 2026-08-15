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
import ChatHome from "./Pages/ChatHome.jsx";
import ChatHomeClone2 from "./Pages/DatingHomePageClone.jsx";
import GuestRoute from "./Secure/GuestRoute.jsx";
import ChatScreen from "./Components/DatingHomePage/ChatScreen.jsx";

import BasicDetails from "./Components/Onboarding/BasicDetails.jsx";
import ProfileDetails from "./Components/Onboarding/ProfileDetails.jsx";
import Prefrences from "./Components/Onboarding/Preferences.jsx";

import Payment from "./Partner/Pages/Payment";
import EbookPage from "./ExternalPages/EbookPage.jsx";
import CheckoutPage from "./ExternalPages/CheckoutPage.jsx";
import PaymentSuccess from "./ExternalPages/PaymentSuccess.jsx";
import ValentineShop from "./ExternalPages/ValentineShop.jsx";
import ValentineCheckout from "./ExternalPages/ValentineCheckout.jsx";
import ValentinePaymentSuccess from "./ExternalPages/ValentinePaymentSuccess.jsx";
import { useEffect } from "react";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import UserProfile from "./Pages/UserProfile.jsx";

//confession routes
import ConfessionMainPage from "./Confession/ConfessionMainPage.jsx";
import CreateConfession from "./Confession/CofessionComponents/CreateConfessionModal.jsx";
import ConfessionNotification from "./Confession/CofessionComponents/NotificationsPage.jsx";
import MyProfilePage from "./Confession/CofessionComponents/MyProfilePage.jsx";

ReactGA.initialize("G-Y2DP2Y0VW2"); // Yaha apni measurement ID daalna

//Vinay branch

function App() {
  useEffect(() => {
    const interval = setInterval(async () => {
      if (window.OneSignal) {
        clearInterval(interval);

        // Permission check
        const permission = await window.OneSignal.Notifications.permission;
        console.log("Permission:", permission);

        if (permission === "granted") {
          // 🔥 ACTUAL SUBSCRIBE STEP
          await window.OneSignal.User.PushSubscription.optIn();
          console.log("Subscribed");
        } else {
          // show prompt
          window.OneSignal.showSlidedownPrompt();
        }
      }
    }, 1000);
  }, []);

  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<DefaultPage />} />
      <Route path="/chatScreen" element={<ChatScreen />} />
      <Route
        path="/chathome"
        element={
          <GuestRoute>
           
            <ChatHome />{" "}
          </GuestRoute>
        }
      />
      <Route
        path="/signUp"
        element={
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        }
      />
      <Route
        path="/guest"
        element={
          <GuestRoute>
            <Input />
          </GuestRoute>
        }
      />
      <Route path="/citychat/:city" element={<CityChat />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      //onboarding routes
      <Route
        path="/signUp/basicdetails"
        element={
          <GuestRoute>
            <BasicDetails />
          </GuestRoute>
        }
      />
      <Route
        path="/signUp/profiledetails"
        element={
          <GuestRoute>
            <ProfileDetails />
          </GuestRoute>
        }
      />
      <Route
        path="/signUp/preferences"
        element={
          <GuestRoute>
            <Prefrences />
          </GuestRoute>
        }
      />
      <Route
        path="/valantinePaymentSuccess"
        element={<ValentinePaymentSuccess />}
      />
      <Route
        path="/confession"
        element={
          <ProtectedRoute>
            <ConfessionMainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confession/create"
        element={
          <ProtectedRoute>
            <CreateConfession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confession/notifications"
        element={
          <ProtectedRoute>
            <ConfessionNotification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confession/profile"
        element={
          <ProtectedRoute>
            <MyProfilePage />
          </ProtectedRoute>
        }
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
        path="/homeClone"
        element={
          <ProtectedRoute>
            <ChatHomeClone2 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Profile"
        element={
          <ProtectedRoute>
            <UserProfile />
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
