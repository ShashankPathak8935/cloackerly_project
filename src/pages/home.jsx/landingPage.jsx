import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { googleLoginApi } from "../../api/Apis.js";
import { createApiFunction } from "../../api/ApiFunction.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../components/toast/toast.jsx";

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

  // Google Login
  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await createApiFunction("post", googleLoginApi, null, {
        token: googleToken,
      });

      if (response && response.data?.token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("plan");

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("plan", JSON.stringify(response.data.plan));
        showSuccessToast("Signin successful!");

        await new Promise((res) => setTimeout(res, 400));
        navigate("/Dashboard/allStats");
      } else {
        showErrorToast("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("❌ Google login error:", err);
      const msg =
        err.response?.data?.message || "Google login failed. Please try again.";
      showErrorToast(msg);
    } finally {
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050814] text-white">
      {/* ================= LEFT : ANIMATED PREMIUM PANEL ================= */}
      <div
        className="hidden xl:flex w-1/2 relative overflow-hidden 
                    bg-black
                  text-white items-center justify-center"
      >
        {/* animated grid */}
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 
                     bg-black"
        />

        {/* floating glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute w-[420px] h-[420px] rounded-full 
                bg-black "
        />

        {/* main content */}
        <motion.div
          initial={{ opacity: 50, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 text-center px-12 max-w-xl"
        >
          {/* logo */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex items-center justify-center mb-6"
          >
            <img
              src="/logo-new.png"
              alt="Clockerly Logo"
              className="w-80 h-35"
            />
          </motion.div>

          {/* heading */}
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to <span className="text-[#0427cb]">Clockerly</span>
            <span className="text-md font-bold text-[#0427cb]">.io</span>
          </h2>

          <p className="mt-4 text-gray-300 leading-relaxed">
            Secure access to your dashboard. Protect campaigns, block bad
            traffic, and maximize ROI — automatically.
          </p>

          {/* animated feature pills */}
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            {["Bot Protection", "Smart Cloaking", "Real-time Analytics"].map(
              (item, i) => (
                <motion.div
                  key={item}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3 + i, repeat: Infinity }}
                  className="px-4 py-2 rounded-full text-sm 
                        bg-white/10 backdrop-blur border border-white/20"
                >
                  {item}
                </motion.div>
              ),
            )}
          </div>
        </motion.div>
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

                  {/* <button
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
                  </button> */}
                  <GoogleOAuthProvider clientId="841461646285-9dimu89k2vjo4cbdj69ound7s0j7jm2s.apps.googleusercontent.com">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        // Send token to backend

                        loginWithGoogle(credentialResponse.credential);
                      }}
                      onError={() => console.log("Login Failed")}
                    />
                  </GoogleOAuthProvider>

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
