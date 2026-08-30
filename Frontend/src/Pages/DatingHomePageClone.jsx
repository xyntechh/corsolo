import React, { useEffect } from "react";
import Navbar from "../Components/DatingHomePage/Navbar.jsx";
import StartChatCard from "../Components/DatingHomePage/StartChatCard.jsx";
import { Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import Sidebar from "../Components/DatingHomePage/Sidebar.jsx";
import MatchHistory from "../Components/DatingHomePage/MatchHistoy.jsx";
import Notifications from "../Components/DatingHomePage/Notifications.jsx";
import FriendRequests from "../Components/DatingHomePage/FriendRequests.jsx";
import { useState } from "react";
import SettingsModal from "../Components/DatingHomePage/SettingsModal.jsx";
import ChatScreen from "../Components/DatingHomePage/ChatScreen.jsx";
import { socket } from "../socket.js";
import toast from "react-hot-toast";
import { useUser } from "../Context/UserContext.jsx";
import PremiumModal from "../Components/DatingHomePage/PremiumModal.jsx";
import ManageInterestsModal from "../Components/DatingHomePage/ManageInterestsModal.jsx";
import GuestPaymentDetailsComponent from "../Components/DatingHomePage/GuestPaymentDetails.jsx";
import SwipeableStartChat from "../Components/DatingHomePage/SwipeableStartChat.jsx";
import OnlineUsersBackdrop from "../Components/DatingHomePage/OnlineUsersBackdrop.jsx";

function DatingHomePageClone() {
  const [showCard, setShowCard] = useState(false);
  const [showMatchHistoryCard, setShowMatchHistoryCard] = useState(false);
  const [showNotificationsCard, setShowNotificationsCard] = useState(false);
  const [showFriendRequestsCard, setShowFriendRequestsCard] = useState(false);
  const [showSettingsModal, setshowSettingsModal] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [manageInterstModal, setmanageInterstModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [GuestPaymentDetails, setGuestPaymentDetails] = useState(null);
  // naya state add karo top pe, baaki states ke saath
  const [isStartChatOpen, setIsStartChatOpen] = useState(true);

  const { user, isMatched, setIsMatched } = useUser();

  //socket Logic
  useEffect(() => {
    socket.on("matched", (data) => {
      setIsMatched(true);
    });
    socket.on("partnerDisconnected", () => {
      toast.error(`Opps!! Your Partner left the chat`);
      setIsMatched(false);
    });
    return () => {
      socket.off("matched");
    };
  }, []);

  useEffect(() => {
    socket.emit("registerUser", user?._id);
  }, [user]);

  return (
    <>
      <div className="h-dvh w-full bg-[#2E2F38] overflow-hidden flex flex-col">
        {/* Top Navbar */}
        <div className="shrink-0 z-50">
          <Navbar
            title="Corsolo.com"
            onlineCount={15}
            showCard={showCard}
            setShowCard={setShowCard}
            showMatchHistoryCard={showMatchHistoryCard}
            setShowMatchHistoryCard={setShowMatchHistoryCard}
            showNotificationsCard={showNotificationsCard}
            setShowNotificationsCard={setShowNotificationsCard}
            showFriendRequestsCard={showFriendRequestsCard}
            setShowFriendRequestsCard={setShowFriendRequestsCard}
            setShowPremium={setShowPremium}
          />
        </div>

        {/* MAIN CONTENT WHERE 3 CONTAINER*/}
        <div className="flex flex-1 min-h-0 w-full">
          {/* Sidebar */}
          <div className="w-72 shrink-0 hidden lg:block">
            <Sidebar
              showSettingsModal={showSettingsModal}
              setshowSettingsModal={setshowSettingsModal}
              showPremium={showPremium}
              setShowPremium={setShowPremium}
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                setIsMatched(true); // taaki ChatScreen wala panel slide-in ho jaye
                setShowCard(false); // sidebar overlay band ho jaye
              }}
            />
          </div>

          {/* Main content */}
          <div
            className={`
    flex-1 min-h-0 relative overflow-hidden
    transition-all duration-300 ease-in-out
    ${showMatchHistoryCard ? "lg:mr-72" : "mr-0"}
  `}
          >
            {/* Background list — poori width, sabse peeche (z-0) */}
            <OnlineUsersBackdrop
              setShowPremium={setShowPremium}
              isCardOpen={isStartChatOpen}
            />

            {/* Start Chat Screen — is par SwipeableStartChat rahega, z-10 se upar */}
            {/* Start Chat Screen */}
            <div
              className={`
    absolute inset-0 z-10
    flex items-end justify-center
    pointer-events-none
    transition-all duration-500 ease-in-out
    ${isMatched ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}
  `}
            >
              <div className="pointer-events-auto w-full">
                <SwipeableStartChat onOpenChange={setIsStartChatOpen}>
                  <StartChatCard
                    manageInterstModal={manageInterstModal}
                    setmanageInterstModal={setmanageInterstModal}
                  />
                </SwipeableStartChat>
              </div>
            </div>

            {/* Chat Screen — same fix */}
            <div
              className={`
    absolute inset-0 z-10
    flex items-end justify-center
    pointer-events-none
    transition-all duration-500 ease-in-out
    ${isMatched ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
  `}
            >
              <div className="pointer-events-auto w-full">
                <ChatScreen
                  chatId={selectedChat?.chatId}
                  friendId={selectedChat?.friendId}
                  partnerName={selectedChat?.name}
                />
              </div>
            </div>
          </div>

          {/* Match History */}
          {/*   Match History Overlay */}
          <div
            onClick={() => setShowMatchHistoryCard(false)}
            className={`
                   fixed inset-0 bg-black/50 backdrop-blur-[2px]
    z-[50] 
    transition-all duration-300 ease-in-out
    ${showMatchHistoryCard ? "opacity-100 visible" : "opacity-0 invisible"}
  `}
          />

          {/* Match History */}
          <div
            className={`
    fixed top-14 right-0 bottom-0 w-72
    bg-[#15151F]
    z-[60] 
    transform transition-transform duration-300 ease-in-out
    ${showMatchHistoryCard ? "translate-x-0" : "translate-x-full"}
  `}
          >
            <MatchHistory
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                setIsMatched(true); // taaki ChatScreen wala panel slide-in ho jaye
                setShowMatchHistoryCard(false); // sidebar overlay band ho jaye
              }}
              selectedChatId={selectedChat?.chatId}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {/* Mobile Sidebar Overlay */}
      <div
        onClick={() => setShowCard(false)}
        className={`fixed inset-0 bg-black/50 z-[50] lg:hidden transition-opacity duration-300 ${showCard ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Sidebar */}
      <div
        className={`
                  fixed top-14 left-0 bottom-0 w-72
    bg-[#1e1e26]
    z-[60]
    lg:hidden
    transform transition-transform duration-300 ease-in-out
    ${showCard ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <Sidebar
          showSettingsModal={showSettingsModal}
          setshowSettingsModal={setshowSettingsModal}
          setShowPremium={setShowPremium}
          onSelectChat={(chat) => {
            setSelectedChat(chat);
            setIsMatched(true); // taaki ChatScreen wala panel slide-in ho jaye
            setShowCard(false); // sidebar overlay band ho jaye
          }}
        />
      </div>

      {/* Notifications */}

      {/* Notifications  Overlay */}
      <div
        onClick={() => setShowNotificationsCard(false)}
        className={`fixed inset-0 bg-black/50 z-[50] transition-opacity duration-300 ${showNotificationsCard ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />
      <div
        className={`
    fixed top-14 right-4 w-72
    bg-[#1e1e26]
    rounded-xl
    shadow-xl
    z-[60]
    origin-top-right
    transition-all duration-300 ease-in-out
    ${
      showNotificationsCard
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-95 -translate-y-3 pointer-events-none"
    }
  `}
      >
        <Notifications />
      </div>

      {/* Friend Requests */}

      {/* Friend Requests Overlay */}
      <div
        onClick={() => setShowFriendRequestsCard(false)}
        className={`fixed inset-0 bg-black/50 z-[50] transition-opacity duration-300 ${showFriendRequestsCard ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <div
        className={`
    fixed top-14 right-4 w-72
    bg-[#1e1e26]
    rounded-xl
    shadow-xl
    z-[60]
    origin-top-right
    transition-all duration-300 ease-in-out
    ${
      showFriendRequestsCard
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-95 -translate-y-3 pointer-events-none"
    }
  `}
      >
        <FriendRequests />
      </div>

      {/* Setting Modal */}
      <>
        {/* Overlay - only mounted when the modal is actually open, so it can never block clicks while closed */}
        {showSettingsModal && (
          <div
            onClick={() => setshowSettingsModal(false)}
            className="fixed inset-0 bg-black/60 z-[90]"
          />
        )}

        {/* Desktop */}
        <div
          className={`
      hidden lg:flex
      fixed inset-0
      items-center justify-center
      z-[100]
      transition-all duration-300
      ${
        showSettingsModal
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }
    `}
        >
          <SettingsModal
            showSettingsModal={showSettingsModal}
            setshowSettingsModal={setshowSettingsModal}
          />
        </div>

        {/* Mobile: pointer-events-none added when closed, so the offscreen sheet
            can never intercept taps meant for the sidebar's footer buttons */}
        <div
          className={`
      lg:hidden
      fixed left-0 right-0 bottom-0
      z-[100]
      transition-transform duration-300
      ${
        showSettingsModal
          ? "translate-y-0 pointer-events-auto"
          : "translate-y-full pointer-events-none"
      }
    `}
        >
          <SettingsModal
            showSettingsModal={showSettingsModal}
            setshowSettingsModal={setshowSettingsModal}
          />
        </div>
      </>

      {/* Premium Modal — Payment Card */}
      {showPremium && (
        <PremiumModal
          setGuestPaymentDetails={setGuestPaymentDetails}
          setShowPremium={setShowPremium}
        />
      )}

      {/* Manage INterst Modal Card */}
      <>
        {/* Overlay - only mounted when the modal is actually open, so it can never block clicks while closed */}
        {manageInterstModal && (
          <div
            onClick={() => setmanageInterstModal(false)}
            className="fixed inset-0 bg-black/60 z-[90]"
          />
        )}

        {/* Desktop */}
        <div
          className={`
      hidden lg:flex
      fixed inset-0
      items-center justify-center
      z-[100]
      transition-all duration-300
      ${
        manageInterstModal
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }
    `}
        >
          <ManageInterestsModal
            manageInterstModal={manageInterstModal}
            setmanageInterstModal={setmanageInterstModal}
          />
        </div>

        {/* Mobile: pointer-events-none added when closed, so the offscreen sheet
            can never intercept taps meant for the sidebar's footer buttons */}
        <div
          className={`
      lg:hidden
      fixed left-0 right-0 bottom-0
      z-[100]
      transition-transform duration-300
      ${
        manageInterstModal
          ? "translate-y-0 pointer-events-auto"
          : "translate-y-full pointer-events-none"
      }
    `}
        >
          <ManageInterestsModal
            manageInterstModal={manageInterstModal}
            setmanageInterstModal={setmanageInterstModal}
          />
        </div>
      </>

      {/*Email and password card that only shows when user is guest and want to buy a coins*/}
      <>
        {/* Overlay - only mounted when the modal is actually open, so it can never block clicks while closed */}
        {GuestPaymentDetails && (
          <div
            onClick={() => setGuestPaymentDetails(false)}
            className="fixed inset-0 bg-black/60 z-[90]"
          />
        )}

        {/* Desktop */}
        <div
          className={`
      hidden lg:flex
      fixed inset-0
      items-center justify-center
      z-[100]
      transition-all duration-300
      ${
        GuestPaymentDetails
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }
    `}
        >
          <GuestPaymentDetailsComponent
            GuestPaymentDetails={GuestPaymentDetails}
            setGuestPaymentDetails={setGuestPaymentDetails}
          />
        </div>

        {/* Mobile: pointer-events-none added when closed, so the offscreen sheet
            can never intercept taps meant for the sidebar's footer buttons */}
        <div
          className={`
      lg:hidden
      fixed left-0 right-0 bottom-0
      z-[100]
      transition-transform duration-300
      ${
        GuestPaymentDetails
          ? "translate-y-0 pointer-events-auto"
          : "translate-y-full pointer-events-none"
      }
    `}
        >
          <GuestPaymentDetailsComponent
            GuestPaymentDetails={GuestPaymentDetails}
            setGuestPaymentDetails={setGuestPaymentDetails}
          />
        </div>
      </>
    </>
  );
}

export default DatingHomePageClone;
