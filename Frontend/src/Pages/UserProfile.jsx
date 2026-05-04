import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Crown,
  LogOut,
  Trash2,
  Pencil,
  Check
} from "lucide-react";

function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    lastLogin: "8 April 2026, 10:30 PM",
    plan: "Premium",
  });

  const [editField, setEditField] = useState(null);

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const renderField = (label, field, icon) => (
    <div className="w-full max-w-md bg-[#1e293b]/70 border border-gray-700 rounded-xl p-4 flex items-center justify-between shadow-md">
      
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs text-gray-400">{label}</p>

          {editField === field ? (
            <input
              value={user[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="bg-transparent border-b border-gray-500 text-white text-sm outline-none"
            />
          ) : (
            <p className="text-sm font-medium">{user[field]}</p>
          )}
        </div>
      </div>

      {/* Edit Button */}
      <div
        className="cursor-pointer"
        onClick={() =>
          setEditField(editField === field ? null : field)
        }
      >
        {editField === field ? (
          <Check size={18} className="text-green-400" />
        ) : (
          <Pencil size={18} />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

      {/* Header */}
      <div className="w-full h-16 flex items-center justify-between px-4 border-b border-gray-700">
        <ArrowLeft
          className="cursor-pointer"
          size={28}
          onClick={() => navigate("/home")}
        />
        <h1 className="text-lg font-semibold">Profile</h1>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-4 py-8 gap-4">

        {/* Profile Circle */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-4 border-white flex items-center justify-center text-3xl font-bold">
          {user.name.charAt(0)}
        </div>

        <h2 className="text-xl font-bold">{user.name}</h2>

        {/* Fields (ALL SEPARATE) */}
        {renderField("Name", "name", <Pencil size={18} />)}
        {renderField("Email", "email", <Mail size={18} />)}
        {renderField("Phone", "phone", <Phone size={18} />)}
        {renderField("Last Login", "lastLogin", <Clock size={18} />)}
        {renderField("Plan", "plan", <Crown size={18} />)}

        {/* Buttons */}
        <div className="w-full max-w-md mt-4 flex flex-col gap-3">

          <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 p-3 rounded-xl font-semibold transition">
            <LogOut size={18} />
            Logout
          </button>

          <button className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 p-3 rounded-xl font-semibold transition">
            <Trash2 size={18} />
            Delete My Account
          </button>

        </div>

      </div>
    </div>
  );
}

export default UserProfile;