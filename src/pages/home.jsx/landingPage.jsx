import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingActions() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex bg-[#050814] text-white">
      {/* ================= LEFT : ANIMATED PREMIUM PANEL ================= */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center px-20">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20 
          bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_1px,_transparent_1px)] 
          bg-[length:36px_36px]"
        />

        {/* Floating glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full 
          bg-indigo-600 blur-[120px]"
        />

        {/* Content */}
        <div className="relative z-10 max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold leading-tight"
          >
            Protect Your Traffic.
            <span className="text-indigo-400"> Maximize Conversions.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-gray-300 mt-4 text-lg"
          >
            CloakShield intelligently filters bad traffic, protects campaigns,
            and boosts ROI — all automatically.
          </motion.p>

          {/* Animated stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: "Blocked Bots", value: "98%" },
              { label: "Faster ROI", value: "2.4x" },
              { label: "Uptime", value: "99.99%" },
            ].map((item, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity }}
                className="bg-white/5 backdrop-blur rounded-xl p-5 text-center"
              >
                <p className="text-2xl font-bold text-indigo-400">
                  {item.value}
                </p>
                <p className="text-sm text-gray-400 mt-1">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT : YOUR EXISTING UI ================= */}
      <div className="flex-1 bg-white flex items-center justify-center px-6">
        {/* ⬇️ PUT YOUR CURRENT LEFT PANEL CODE HERE ⬇️ */}
        <div
          className="flex-1 flex items-center justify-center px-6 
  bg-[radial-gradient(circle_at_top,#f1f5ff_0%,#ffffff_45%,#f8fafc_100%)]"
        >
          <div className="relative w-full max-w-[420px]">
            {/* background glow */}
            <div
              className="absolute -inset-6 rounded-3xl 
      bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-transparent blur-2xl"
            />

            {/* main glass card */}
            <div
              className="relative rounded-3xl p-8 
      bg-white/70 backdrop-blur-xl 
      border border-white/60 
      shadow-[0_40px_90px_rgba(79,70,229,0.15)]"
            >
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                {user ? "Welcome back" : "Sign in to your account"}
              </h1>

              <p className="text-slate-500 text-sm mb-7">
                {user
                  ? "Continue managing your campaigns"
                  : "Securely access your dashboard and performance insights."}
              </p>

              {!user && (
                <>
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() =>
                      showErrorToast("Google login is not yet implemented.")
                    }
                    className="w-full flex items-center justify-center gap-3 py-3 
            rounded-xl border border-slate-200 
            bg-white hover:bg-slate-50 
            shadow-sm transition cursor-pointer"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Continue with Google
                    </span>
                  </button>

                  {/* divider */}
                  <div className="flex items-center gap-3 my-7">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">
                      OR
                    </span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                </>
              )}

              {user ? (
                <>
                  <PrimaryButton
                    label="Go to Dashboard"
                    onClick={() => navigate("/dashboard/allStats")}
                  />

                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 py-3 rounded-xl 
            border border-red-500/40 text-red-500 
            hover:bg-red-50 transition cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <PrimaryButton
                    label="Sign In"
                    onClick={() => navigate("/signin")}
                  />

                  <p className="text-center text-sm text-slate-600 mt-6">
                    Don’t have an account?{" "}
                    <span
                      onClick={() => navigate("/signup")}
                      className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                    >
                      Sign Up
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NOTHING ELSE CHANGED */}
      </div>
    </div>
  );
}

/* ================= BUTTON ================= */
function PrimaryButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-[14px] rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
    >
      {label}
    </button>
  );
}
