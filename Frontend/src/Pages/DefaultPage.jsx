import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import { MessageCircle, Video, MapPin, ShieldCheck, Mail } from "lucide-react";


import Footer from "../Components/Footer";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const featuresData = [
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-400" />,
      title: "Random Text Chat",
      description:
        "Instantly connect with strangers from around the world and enjoy private one-on-one conversations.",
    },
    {
      icon: <Video className="w-8 h-8 text-purple-400" />,
      title: "HD Video Chat",
      description:
        "Start secure face-to-face video calls with real people anytime, anywhere.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-purple-400" />,
      title: "Find People Nearby",
      description:
        "Discover and connect with verified people in your city for genuine companionship.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-purple-400" />,
      title: "Safe & Private",
      description:
        "Enjoy encrypted chats, verified profiles, and powerful moderation for a secure experience.",
    },
  ];

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-purple-500 font-semibold"
      : "text-white hover:text-purple-400 transition";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white overflow-x-hidden font-poppins">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16 py-4">
            <NavLink
              to="/"
              className="text-3xl font-bold text-purple-500 tracking-wide"
            >
              Corsolo
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>

              <NavLink to="/feature" className={linkClass}>
                Features
              </NavLink>

              <NavLink to="/pricing" className={linkClass}>
                Pricing
              </NavLink>

              <NavLink to="/contact" className={linkClass}>
                Contact
              </NavLink>
            </div>

            <Link to="/login" className="hidden md:block">
              <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition">
                Login
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(true)} className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-center items-center gap-8 text-xl transition-all duration-300 ${
            menuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={linkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/feature"
            onClick={() => setMenuOpen(false)}
            className={linkClass}
          >
            Features
          </NavLink>

          <NavLink
            to="/pricing"
            onClick={() => setMenuOpen(false)}
            className={linkClass}
          >
            Pricing
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={linkClass}
          >
            Contact
          </NavLink>

          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <button className="px-8 py-3 bg-purple-600 rounded-full font-semibold">
              Login
            </button>
          </Link>

          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 md:px-16 lg:px-24 xl:px-32 pt-32 pb-20">
          {/* Background Glow */}
          <div className="absolute w-[450px] h-[450px] bg-purple-600/30 blur-[180px] rounded-full"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Talk to Strangers.
              <br />
              Make Real Connections.
            </h1>

            <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-8">
              Random text chat, private video chat and find companions in your
              city — all in one secure platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/chathome">
                <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition">
                  Random Chat
                </button>
              </Link>

              <button className="border border-purple-500 hover:bg-purple-900/20 px-8 py-3 rounded-full font-semibold transition">
                Video Chat
              </button>
            </div>
          </div>

          <img
            src={heroImage}
            className="w-full max-w-4xl rounded-xl mt-16"
            alt="Gym management showcase"
          />
        </section>

        {/* Features */}
        <section className="relative px-6 md:px-16 lg:px-24 xl:px-32 py-24 bg-black text-white font-poppins">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600 blur-[300px] -z-10"></div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet. Chat. Connect.
            </h2>

            <p className="text-gray-300 text-base md:text-lg">
              Experience random text chat, HD video calls, and local
              companionship with a safe, private, and seamless chatting
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-gray-900 rounded-xl border border-gray-800 hover:bg-purple-950 transition"
              >
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <div className="w-full rounded-3xl bg-[#18191B] p-8 flex flex-col justify-center gap-8 text-white border border-purple-800/30">
          <h2 className="text-3xl font-bold text-purple-400">Support</h2>

          <p className="text-gray-300 leading-7">
            We're here to help! Whether you have questions about random chat,
            video chat, account verification, or anything else, feel free to
            reach out to us.
          </p>

          <div className="bg-black/40 border border-purple-800/40 rounded-2xl p-5">
            <div className="flex items-center gap-3 text-purple-400 font-semibold text-lg">
              <Mail size={22} />
              Email Support
            </div>

            <a
              href="mailto:corsoloenterprices@gmail.com"
              className="mt-3 block text-white hover:text-purple-400 transition break-all"
            >
              corsoloenterprices@gmail.com
            </a>
          </div>

          <div className="text-sm text-gray-400">
            We usually respond within{" "}
            <span className="text-purple-400">24 hours.</span>
          </div>
        </div>

       <Footer />
      </div>
    </>
  );
}
