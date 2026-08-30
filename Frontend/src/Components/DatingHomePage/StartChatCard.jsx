import React, { useState } from "react";
import { Video, MessagesSquare, Gem, Settings2, Users } from "lucide-react";
import { socket } from "../../socket";
import { useUser } from "../../Context/UserContext";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import InsufficientCoinsModal from "./InsufficientCoinsModal.jsx";

import axios from "axios";

const defaultInterests = ["Gardening", "Pets", "Science"];

const genderOptions = [
  {
    key: "male",
    label: "Male",
    emoji: (
      <div className=" rounded-md bg-[#1B1B27] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fontSize="22"
          className="text-purple-500"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M18.41 3.41L16 4.5l2.41 1.09L19.5 8l1.1-2.41L23 4.5l-2.4-1.09L19.5 1M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10c0-1.47-.33-2.87-.9-4.13l-1.24 2.72c.08.46.14.91.14 1.41c0 4.43-3.57 8-8 8s-8-3.57-8-8v-.13a10 10 0 0 0 5.74-5.56A10 10 0 0 0 17.5 10a10 10 0 0 0 1.33-.09l-1.48-3.26L12.6 4.5l3.53-1.6C14.87 2.33 13.47 2 12 2m-3 9.75A1.25 1.25 0 0 0 7.75 13A1.25 1.25 0 0 0 9 14.25A1.25 1.25 0 0 0 10.25 13A1.25 1.25 0 0 0 9 11.75m6 0A1.25 1.25 0 0 0 13.75 13A1.25 1.25 0 0 0 15 14.25A1.25 1.25 0 0 0 16.25 13A1.25 1.25 0 0 0 15 11.75"
          ></path>
        </svg>
      </div>
    ),
    premium: true,
  },
  {
    key: "random",
    label: "Random",
    emoji: <Users size={22} className="text-purple-500" />,
    premium: false,
  },
  {
    key: "female",
    label: "Female",
    emoji: (
      <div className=" rounded-md bg-[#1B1B27] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fontSize="22"
          className="text-purple-500"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="m19.5 1l-1.09 2.41L16 4.5l2.41 1.09L19.5 8l1.1-2.41L23 4.5l-2.4-1.09zM12 2C6.5 2 2 6.5 2 12v10h20V12c0-1.47-.33-2.87-.9-4.13l-1.24 2.72c.08.46.14.91.14 1.41c0 4.43-3.57 8-8 8s-8-3.57-8-8v-.13a10 10 0 0 0 5.74-5.56A10 10 0 0 0 17.5 10a10 10 0 0 0 1.33-.09l-1.48-3.26L12.6 4.5l3.53-1.6C14.87 2.33 13.47 2 12 2m-3 9.75A1.25 1.25 0 0 0 7.75 13A1.25 1.25 0 0 0 9 14.25A1.25 1.25 0 0 0 10.25 13A1.25 1.25 0 0 0 9 11.75m6 0A1.25 1.25 0 0 0 13.75 13A1.25 1.25 0 0 0 15 14.25A1.25 1.25 0 0 0 16.25 13A1.25 1.25 0 0 0 15 11.75"
          ></path>
        </svg>
      </div>
    ),
    premium: true,
  },
];

const REQUIRED_COINS = 10;

function StartChatCard({
  interests = defaultInterests,
  setmanageInterstModal,
  setShowPremium,
}) {
  //states
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInsufficientCoins, setShowInsufficientCoins] = useState(false);
  const { fetchUser } = useUser();

  //CONTEXT
  const { user, setChatPreferences, isMatched, setIsMatched } = useUser();

  //first socket event
  const startChat = async () => {
    // Random free hai
    if (gender === "male" || gender === "female") {
      if ((user?.coin ?? 0) < REQUIRED_COINS) {
        setShowInsufficientCoins(true);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/debit`,
          {
            coin: REQUIRED_COINS,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Coin deducted:", response.data);
        fetchUser(); // Update user data after coin deduction
      } catch (error) {
        console.error(
          "Coin deduction failed:",
          error.response?.data || error.message,
        );

        toast.error(error.response?.data?.message || "Unable to deduct coins");

        return; // coin deduct nahi hua toh chat start mat karo
      }
    }

    const payload = {
      userId: user?._id,
      gender: user?.gender,
      mode: gender,
      lookingFor: user?.lookingFor,
      partnerName: user?.name,
    };

    socket.emit("startChat", payload);

    console.log("startChat payload:", payload);
    setChatPreferences(payload);
  };

  useEffect(() => {
    socket.on("waitingForMatch", () => {
      setLoading(true);
    });

    socket.on("matched", (data) => {
      setLoading(false);
      console.log("matched", data);
    });

    socket.on("alreadyWaiting", () => {
      toast.error("Please wait for 30 seconds.");
    });

    socket.on("waitingOver", () => {
      setLoading(false);
      toast.error("No partner found. Please try again.");
      setIsMatched(false);
    });

    socket.on("matchCancelled", () => {
      setLoading(false);
    });

    return () => {
      socket.off("waitingForMatch");
      socket.off("matched");
      socket.off("alreadyWaiting");
      socket.off("waitingOver");
    };
  }, []);

  return (
    <>
      {/* NOTE: top rounding removed (rounded-b-[24px] instead of rounded-t-[24px])
          and top border dropped (border-t-0) — the SwipeableStartChat handle now
          sits directly on top of this box and supplies the top border, so the
          two pieces look like one seamless card. Width/centering (max-w-xl,
          px-4 sm:px-7) is now owned by the wrapper, not this component. */}
      <div className="w-full max-w-xl rounded-b-[24px] bg-[#15151F] border border-white/10 border-t-0 p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Your Interests</h2>
            <span className="text-green-400 text-sm font-medium">(ON)</span>
          </div>
          <button
            type="button"
            onClick={() => setmanageInterstModal(true)}
            className="text-sm font-medium text-purple-400 hover:text-purple-300"
          >
            Manage
          </button>
        </div>
        {/* Interests box */}
        <div className="mt-4 rounded-md border border-dashed border-white/20 p-3">
          <div className="flex flex-wrap gap-2">
            {interests.map((item) => (
              <span
                key={item}
                className="rounded-md bg-[#262634] px-4 py-2 text-xs font-medium text-white"
              >
                {item}
              </span>
            ))}
          </div>
          {interests.length === 0 ? (
            <p className="mt-3 text-xs text-gray-400">
              You have no interests. Click to add some.
            </p>
          ) : (
            <p className="mt-3 text-xs text-gray-400">
              Tap "Manage" to add or remove interests.
            </p>
          )}
        </div>
        {/* Gender Filter */}
        <div className="mt-1">
          <h3 className="mb-4 text-lg font-bold text-white">Gender Filter</h3>

          <div className="grid grid-cols-3 gap-3">
            {genderOptions.map(({ key, label, emoji, premium }) => {
              const active = gender === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setGender(key)}
                  className={`relative h-20 rounded-md border transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    active
                      ? "border-purple-500 bg-[#222233]"
                      : "border-white/10 bg-[#1B1B27] hover:border-white/20"
                  }`}
                >
                  {premium && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 border-2 border-[#15151F]">
                      <Gem size={11} className="text-white" />
                    </span>
                  )}
                  <span className="  bg-white/5 flex items-center justify-center text-xl">
                    {emoji}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      active ? "text-purple-300" : "text-gray-300"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            aria-label="Start video chat"
            className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-orange-500"
          >
            <Video size={22} className="text-white" fill="white" />
          </button>

          <button
            onClick={startChat}
            disabled={loading}
            className="
    flex-1 h-12 rounded-md
    bg-gradient-to-r from-indigo-600 to-purple-600
    flex items-center justify-center gap-2
    font-semibold text-white
    transition-all duration-200 ease-out
    hover:scale-[1.02]
    active:scale-95
    active:brightness-90
    disabled:opacity-70
    disabled:cursor-not-allowed
    disabled:hover:scale-100
  "
          >
            {loading ? (
              <>
                <ClipLoader color="#fff" size={20} />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <MessagesSquare size={20} />
                <span>Start Text Chat</span>
              </>
            )}
          </button>
        </div>
        {/* Footer note */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Be respectful and follow our{" "}
          <a
            href="#"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            chat rules
          </a>
        </p>
      </div>

      {showInsufficientCoins && (
        <InsufficientCoinsModal
          requiredCoins={REQUIRED_COINS}
          currentCoins={user?.coins ?? 0}
          gender={gender}
          onClose={() => setShowInsufficientCoins(false)}
          onBuyCoins={() => {
            setShowInsufficientCoins(false);
            setShowPremium?.(true); // opens your coins/premium modal
          }}
        />
      )}
    </>
  );
}

export default StartChatCard;