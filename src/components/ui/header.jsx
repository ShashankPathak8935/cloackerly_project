import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  LogOut,
  User,
  HelpCircle,
  DollarSign,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFunction } from "../../api/ApiFunction";
import { getUpdatedPlan, signOutApi } from "../../api/Apis";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const avatarRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [planName, setPlanName] = useState();
  const [planStatus, setPlanStatus] = useState();

  // Example plan data (replace later with API)
  const fetchUpdatedPlan = async () => {
    try {
      const response = await apiFunction("get", getUpdatedPlan, null, null);

      const plan = response?.data?.data;
      console.log(plan?.status);

      if (plan) {
        localStorage.setItem("plan", JSON.stringify(plan));
        setPlanName(plan?.Plan?.name);
        setPlanStatus(plan?.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch plan
  useEffect(() => {
    fetchUpdatedPlan();
  }, []);

  const handleLogout = async () => {
    const response = await apiFunction("get", signOutApi, null, null);
    if (response) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("plan");
      localStorage.removeItem("todo_tasks");

      navigate("/");
    }
  };

  return (
    <header
      className="
  sticky top-0 z-50 w-full
  bg-gradient-to-r from-white via-blue-50 to-white
  backdrop-blur-2xl
  border-b border-blue-100/60
  px-8 py-4
"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <SlidersHorizontal
            onClick={onMenuClick}
            className="
    w-6 h-6 cursor-pointer
    text-emerald-600
    hover:text-emerald-700
    transition hover:scale-105
  "
          />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              Clockerly
            </span>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 max-w-xl">
          <div
            className="
        flex items-center gap-3
        px-4 py-2.5
        rounded-xl
        bg-white
        border border-blue-200/60
        shadow-[0_8px_30px_rgba(59,130,246,0.15)]
        focus-within:ring-2 focus-within:ring-blue-400/50
        transition
      "
          >
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-4.35-4.35" />
              <circle cx="10" cy="10" r="7" />
            </svg>

            <input
              type="text"
              placeholder="Search campaigns, domains, reports..."
              className="
            w-full bg-transparent outline-none
            text-sm text-gray-800
            placeholder:text-gray-400
          "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          {/* PLAN */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-900">Plan :</span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              {planName || "N/A"}
            </span>
            <span
              className="
          px-2 py-1 rounded-full text-xs font-semibold
          bg-emerald-100 text-emerald-700
        "
            >
              {planStatus || "N/A"}
            </span>
          </div>

          {/* 🔔 NOTIFICATION ICON */}
          <button
            className="
      relative
      w-9 h-9
      flex items-center justify-center
      rounded-full
      bg-blue-50
      text-blue-600
      hover:bg-blue-100
      transition
    "
          >
            {/* Bell Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0"
              />
            </svg>

            {/* 🔴 Notification Dot (optional) */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* AVATAR */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="
            w-9 h-9 rounded-full
            ring-2 ring-blue-200
            hover:ring-blue-400
            transition-transform hover:scale-105
            overflow-hidden
          "
            >
              {user?.image ? (
                <img src={user.image} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="
              w-full h-full bg-blue-600
              text-white flex items-center justify-center
              font-semibold text-sm
            "
                >
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {showProfileModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="
                absolute right-0 mt-4 w-56
                rounded-2xl
                bg-white
                border border-blue-100
                shadow-[0_30px_70px_rgba(59,130,246,0.25)]
                overflow-hidden
              "
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {[
                    {
                      label: "My Profile",
                      icon: User,
                      action: () => navigate("/myProfile"),
                    },
                    {
                      label: "Pricing",
                      icon: DollarSign,
                      action: () => navigate("/"),
                    },
                    {
                      label: "Help",
                      icon: HelpCircle,
                      action: () => navigate("/help"),
                    },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="
                    flex items-center w-full px-4 py-3
                    text-sm text-gray-700
                    hover:bg-blue-50 transition
                  "
                    >
                      <item.icon className="w-4 h-4 mr-3 text-blue-500" />
                      {item.label}
                    </button>
                  ))}

                  <div className="border-t border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="
                  flex items-center w-full px-4 py-3
                  text-sm text-red-600
                  hover:bg-red-50 transition
                "
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
