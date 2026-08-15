import React from "react";
import { MessageCircle, Video, MapPin, ShieldCheck, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-purple-900/30 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-purple-500">Corsolo</h2>

            <p className="mt-5 text-gray-400 leading-8 max-w-md">
              Meet new people through random text chat, private video calls, and
              meaningful connections in your city. Safe, anonymous, and built
              for genuine conversations.
            </p>

            <div className="mt-6">
              <a
                href="mailto:corsoloenterprices@gmail.com"
                className="text-purple-400 hover:text-purple-300 transition"
              >
                corsoloenterprices@gmail.com
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Navigation
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">
              <a href="/" className="hover:text-purple-400 transition">
                Home
              </a>

              <a href="/feature" className="hover:text-purple-400 transition">
                Features
              </a>

              <a href="/contact" className="hover:text-purple-400 transition">
                Contact
              </a>

              <a href="/login" className="hover:text-purple-400 transition">
                Login
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>

            <div className="flex flex-col gap-4 text-gray-400">
              <a
                href="/privacy-policy"
                className="hover:text-purple-400 transition"
              >
                Privacy Policy
              </a>

              <a href="/terms" className="hover:text-purple-400 transition">
                Terms & Conditions
              </a>

              <a
                href="/community-guidelines"
                className="hover:text-purple-400 transition"
              >
                Community Guidelines
              </a>

              <a href="/safety" className="hover:text-purple-400 transition">
                Safety Center
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-500 font-medium">
              Corsolo Enterprises
            </span>
            . All Rights Reserved.
          </p>

          <p className="text-gray-500 text-center">
            ❤️ Made for meaningful connections.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
