import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useSignup } from "../../Context/SignupContext";
import axios from "axios";

const sideFeatures = [
  {
    icon: Heart,
    title: "Match Your Vibe",
    desc: "Tell us what you're looking for and who with.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    desc: "Your data and conversations stay private.",
  },
  {
    icon: Sparkles,
    title: "Real Connections",
    desc: "Thousands of people online right now.",
  },
];

const lookingForOptions = ["Men", "Women", "Everyone"];

const interestedInOptions = [
  "Dating",
  "Serious Relationship",
  "Marriage",
  "Friendship",
  "Casual",
  "Networking",
];

const interestOptions = [
  { label: "Gym", emoji: "💪" },
  { label: "Travel", emoji: "✈️" },
  { label: "Music", emoji: "🎵" },
  { label: "Movies", emoji: "🎬" },
  { label: "Photography", emoji: "📷" },
  { label: "Cricket", emoji: "🏏" },
  { label: "Football", emoji: "⚽" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Reading", emoji: "📚" },
  { label: "Coding", emoji: "💻" },
  { label: "Coffee", emoji: "☕" },
  { label: "Pets", emoji: "🐶" },
  { label: "Food", emoji: "🍕" },
  { label: "Hiking", emoji: "🥾" },
  { label: "Fashion", emoji: "👗" },
  { label: "Art", emoji: "🎨" },
  { label: "Dance", emoji: "💃" },
  { label: "Bike Rides", emoji: "🏍️" },
  { label: "Anime", emoji: "🎌" },
  { label: "Netflix", emoji: "🍿" },
  { label: "Yoga", emoji: "🧘" },
  { label: "Fitness", emoji: "🏋️" },
  { label: "Nature", emoji: "🌿" },
  { label: "Beach", emoji: "🏖️" },
  { label: "Singing", emoji: "🎤" },
  { label: "Writing", emoji: "✍️" },
  { label: "Cooking", emoji: "🍳" },
  { label: "Cars", emoji: "🚗" },
  { label: "Comedy", emoji: "😂" },
  { label: "Spirituality", emoji: "🕉️" },
];

function Preferences() {
  const [lookingFor, setLookingFor] = useState("");
  const [interestedIn, setInterestedIn] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signupData, clearSignup } = useSignup();

  useEffect(() => {
    // Prevent body scroll and zoom
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  const toggleInterestedIn = (option) => {
    setInterestedIn((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const toggleInterest = (label) => {
    setInterests((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  //3RD SETP OF SINGUP AND CHECKING THE VALIDATION OF THE PREFERENCES AND INTERESTS AND API CALL

  const handleFinish = async () => {
    if (!lookingFor || interestedIn.length === 0 || interests.length < 3) {
      toast.error(
        !lookingFor
          ? "Please select who you're looking for"
          : interestedIn.length === 0
            ? "Please select what you're interested in"
            : "Please select at least 3 interests",
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...signupData,
        lookingFor,
        interestsIn: interestedIn,
        yourInterests: interests,
      };

      console.log(payload);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signup`,
        payload,
      );

      if (res.data.success) {
        localStorage.setItem("authToken", res.data.data.token);
        toast.success("Welcome to the community");

        clearSignup();

        navigate("/homeClone");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full bg-[#08080B] overflow-hidden text-white flex flex-col">
      {/* Background Glow — same treatment as the rest of the app */}
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-500/20 blur-[180px] rounded-full" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />

      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-4 lg:px-10 py-4 sm:py-6">
        <div className="w-full max-w-6xl h-full lg:h-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — desktop-only brand panel */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
              <Heart size={15} className="text-purple-500 shrink-0" />
              Anonymous • Safe • Real Connections
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-tight mt-6">
              Almost
              <br />
              <span className="text-purple-500">There</span>
            </h1>

            <p className="text-gray-400 mt-6 text-lg leading-8 max-w-md">
              Share your preferences and interests so we can match you with
              people who truly vibe with you.
            </p>

            <div className="mt-10 space-y-5">
              {sideFeatures.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-center">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <Icon className="text-purple-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{title}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — preferences card */}
          <div className="flex justify-center lg:justify-end h-full min-h-0">
            <div className="relative w-full max-w-md h-full min-h-0 lg:h-auto">
              {/* Card glow */}
              <div className="pointer-events-none absolute inset-0 bg-purple-500/20 blur-3xl rounded-[40px]" />

              <div className="relative bg-[#0D0D11]/95 backdrop-blur-xl border border-purple-500/40 rounded-[28px] shadow-2xl flex flex-col h-full min-h-0 lg:h-auto lg:max-h-[85vh]">
                {/* Scrollable content */}
                <div className="flex-1 min-h-0 flex flex-col gap-6 p-6 sm:p-8 overflow-y-auto overscroll-contain">
                  {/* Step indicator */}
                  <div className="flex justify-center gap-2 shrink-0">
                    <span className="h-1.5 w-8 rounded-full bg-purple-500" />
                    <span className="h-1.5 w-8 rounded-full bg-purple-500" />
                    <span className="h-1.5 w-8 rounded-full bg-purple-500" />
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-center tracking-wide">
                      Preferences
                    </h1>
                    <p className="text-center text-gray-400 text-xs sm:text-sm">
                      Help us find your perfect match
                    </p>
                  </div>

                  {/* Looking For */}
                  <div className="flex flex-col gap-2.5 shrink-0">
                    <h3 className="text-sm font-semibold text-gray-200">
                      Looking For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {lookingForOptions.map((option) => {
                        const active = lookingFor === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setLookingFor(option)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                              active
                                ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,.5)]"
                                : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interested In */}
                  <div className="flex flex-col gap-2.5 shrink-0">
                    <h3 className="text-sm font-semibold text-gray-200">
                      Interested In
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {interestedInOptions.map((option) => {
                        const active = interestedIn.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleInterestedIn(option)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                              active
                                ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,.5)]"
                                : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50"
                            }`}
                          >
                            {active && <Check size={13} />}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-col gap-2.5 shrink-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-200">
                        Your Interests
                      </h3>
                      <span className="text-[11px] text-gray-500">
                        {interests.length} selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(({ label, emoji }) => {
                        const active = interests.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleInterest(label)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
                              active
                                ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,.5)]"
                                : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50"
                            }`}
                          >
                            <span>{emoji}</span>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer actions — pinned */}
                <div className="shrink-0 flex flex-col gap-4 p-6 sm:p-8 pt-4 border-t border-white/10">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="h-12 w-12 shrink-0 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={loading}
                      className="flex-1 h-12 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11]"
                    >
                      {loading ? (
                        <ClipLoader size={22} color="#fff" />
                      ) : (
                        <>
                          Finish
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center text-gray-500 text-[10px] sm:text-xs">
                    By continuing, you agree to our Terms & Conditions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preferences;