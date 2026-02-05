import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createApiFunction } from "../api/ApiFunction";
import { logInApi } from "../api/Apis";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { googleLoginApi } from "../api/Apis.js";

import { showErrorToast, showSuccessToast } from "../components/toast/toast";

export default function LoginPage() {
  const navigate = useNavigate();

  // ✅ UI & Form States
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit Handler with full safety
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Frontend validation
    if (!formData.email.trim() || !formData.password.trim()) {
      showErrorToast("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createApiFunction(
        "post",
        logInApi,
        null,
        formData,
      );
      console.log("✅ Login response:", response);

      if (response && response.data?.token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

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
      console.error("❌ Login error:", err);
      const msg =
        err.response?.data?.message ||
        "Invalid credentials or server error. Please try again.";
      showErrorToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Login
  const loginWithGoogle = async (googleToken) => {
    
    if (isSubmitting) return;
    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* LEFT PANEL */}
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
            <img src="/logo.png" alt="Clockerly Logo" className="w-35 h-35" />
          </motion.div>

          {/* heading */}
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to <span className="text-[#CBFA23]">Clockerly</span><span className="text-md font-bold text-[#CBFA23]">.io</span>
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

      {/* RIGHT PANEL */}
      {/* <div className="w-full xl:w-1/2 bg-white flex flex-col justify-center px-8 md:px-20 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
        <p className="text-gray-500 mb-8">
          Enter your email and password to access your dashboard.
        </p>

        
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            type="button"
            className="flex items-center justify-center w-1/2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            onClick={() =>
              showErrorToast("Google login is not yet implemented.")
            }
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>
        </div>

        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-200" />
          <span className="px-3 text-gray-400 text-sm">Or</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        
        <form
          onSubmit={onSubmit}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        >
        
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="info@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

      
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer select-none"
                role="button"
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>

        
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mr-2 rounded text-indigo-600"
              />
              Keep me logged in
            </label>
            <Link
              to="/reset-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

        
          <button
            disabled={isSubmitting}
            onClick={!isSubmitting ? onSubmit : undefined}
            className={`w-full py-2.5 rounded-lg font-medium cursor-pointer transition flex items-center justify-center gap-2
              ${
                isSubmitting
                  ? "bg-indigo-400 text-white cursor-not-allowed opacity-70"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
              }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          
          <p className="text-sm text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div> */}
      <div className="w-full xl:w-1/2 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl px-8 py-10">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-8">
            Please enter your details to sign in
          </p>

          {/* FORM */}
          <form
            onSubmit={onSubmit}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Email address
              </label>

              <div className="relative mt-1">
                <EnvelopeIcon className="h-4 w-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />

                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-full border border-gray-300
            pl-11 pr-4 py-3 text-sm text-gray-800
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
            outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>

              <div className="relative mt-1">
                <LockClosedIcon className="h-4 w-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-full border border-gray-300
            pl-11 pr-11 py-3 text-sm text-gray-800
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
            outline-none"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
            text-gray-400 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                Remember me
              </label>

              <Link
                to="/reset-password"
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              disabled={isSubmitting}
              onClick={!isSubmitting ? onSubmit : undefined}
              className={`w-full rounded-full py-3 text-sm font-semibold
        transition flex justify-center items-center gap-2
        ${
          isSubmitting
            ? "bg-indigo-300 text-white"
            : "bg-blue-800 from-indigo-600 to-purple-600 text-white hover:opacity-90"
        }`}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 text-xs text-gray-800">
              <div className="flex-1 h-px bg-gray-200" />
              OR
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            {/* <button
              type="button"
              onClick={() =>
                showErrorToast("Google login is not yet implemented.")
              }
              className="w-full flex items-center justify-center gap-3
        border border-gray-300 rounded-full py-3 text-sm text-gray-800
        hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-4 h-4"
              />
              Continue with Google
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

            {/* Footer */}
            <p className="text-xs text-center text-gray-500">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
