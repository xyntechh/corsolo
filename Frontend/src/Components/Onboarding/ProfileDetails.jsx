import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Heart,
  ImagePlus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useSignup } from "../../Context/SignupContext";
import axios from "axios";

const sideFeatures = [
  {
    icon: ImagePlus,
    title: "Show Your Best Side",
    desc: "A great photo and bio help you get noticed.",
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

function ProfileDetails() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false); // 👈 naya state (optional, alag loading dikhane ke liye)

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { updateSignup } = useSignup();

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

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData,
    );

    return res.data.secure_url;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleBack = () => {
    navigate(-1);
  };

  // SECOND STEP OF THE SINGUP
  const handleNext = async () => {
    if (!bio || !country || !state || !city) {
      toast.error("Please fill in all details!");
      return;
    }

    setLoading(true);

    try {
      let profilePictureUrl = "";

      // 👇 agar user ne photo select ki hai, tabhi upload karo
      if (photo) {
        profilePictureUrl = await uploadToCloudinary(photo);
      }

      updateSignup({
        bio,
        country,
        state,
        city,
        profilePicture: profilePictureUrl, // 👈 ab yahan Cloudinary ka URL jayega
      });

      toast.success("Profile saved!");
      navigate("/signup/preferences");
    } catch (error) {
      console.error("Profile details error:", error);
      toast.error("Something went wrong while uploading photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#08080B] overflow-hidden text-white">
      {/* Background Glow — same treatment as the rest of the app */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-500/20 blur-[180px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 lg:px-10 overflow-y-auto py-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — desktop-only brand panel */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
              <Heart size={15} className="text-purple-500 shrink-0" />
              Anonymous • Safe • Real Connections
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-tight mt-6">
              Build Your
              <br />
              <span className="text-purple-500">Profile</span>
            </h1>

            <p className="text-gray-400 mt-6 text-lg leading-8 max-w-md">
              Add a photo, write a short bio, and let people know where you're
              from.
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

          {/* RIGHT — profile details card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Card glow */}
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-[40px]" />

              <div className="relative bg-[#0D0D11]/95 backdrop-blur-xl border border-purple-500/40 rounded-[28px] p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
                {/* Step indicator */}
                <div className="flex justify-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-purple-500" />
                  <span className="h-1.5 w-8 rounded-full bg-purple-500" />
                  <span className="h-1.5 w-8 rounded-full bg-white/10" />
                </div>

                <div className="flex flex-col gap-1.5 -mt-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-center tracking-wide">
                    Complete Your Profile
                  </h1>
                  <p className="text-center text-gray-400 text-xs sm:text-sm">
                    Add a photo and tell us a bit more
                  </p>
                </div>

                {/* Photo upload */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-purple-500/40 hover:border-purple-500 flex items-center justify-center overflow-hidden transition-colors group"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-purple-400 transition-colors">
                        <ImagePlus size={22} />
                        <span className="text-[10px]">Add Photo</span>
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-3">
                  <textarea
                    placeholder="Write a short bio about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={150}
                    rows={3}
                    className="p-3 rounded-xl bg-white/5 placeholder-gray-500 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition resize-none"
                    style={{ fontSize: "16px" }}
                  />
                  <div className="text-right text-[11px] text-gray-500 -mt-2">
                    {bio.length}/150
                  </div>

                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-3 pl-9 rounded-xl bg-white/5 placeholder-gray-500 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="p-3 rounded-xl bg-white/5 placeholder-gray-500 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition"
                      style={{ fontSize: "16px" }}
                    />

                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="p-3 rounded-xl bg-white/5 placeholder-gray-500 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </div>

                {/* Back + Next buttons */}
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
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 h-12 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11]"
                  >
                    {loading ? (
                      <ClipLoader size={22} color="#fff" />
                    ) : (
                      <>
                        Next
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

                <div className="h-px bg-white/10" />

                {/* Footer */}
                <div className="text-center text-gray-500 text-[10px] sm:text-xs">
                  By continuing, you agree to our Terms & Conditions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
