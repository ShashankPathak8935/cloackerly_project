import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { updatePassword } from "../api/Apis";
import { createApiFunction } from "../api/ApiFunction";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import { motion } from "framer-motion";
import {
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  // Strong Password Regex
  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!email) {
      showErrorToast("Session expired. Please try again.");
      navigate("/reset-password");
    }
  }, []);

  // Submit Function
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      showErrorToast("OTP is required");
      return;
    }

    // 🔥 OTP must be exactly 4 digits
    if (formData.otp.length !== 6) {
      showErrorToast("OTP must be 6 digits");
      return;
    }

    if (!formData.otp.trim()) {
      showErrorToast("OTP is required");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      showErrorToast("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showErrorToast("Passwords do not match!");
      return;
    }

    if (!strongPasswordRegex.test(formData.newPassword)) {
      showErrorToast(
        "Password must be at least 8 chars, include 1 uppercase letter, 1 number & 1 special character.",
      );
      return;
    }
    try {
      setIsSubmitting(true);

      const res = await createApiFunction("post", updatePassword, null, {
        email: email,
        otp: formData.otp,
        password: formData.newPassword,
      });

      showSuccessToast(res?.data?.message || "Password updated successfully!");
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/signin");
      }, 800);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

        {/* RIGHT PANEL */}
        <div className="w-full xl:w-1/2 bg-white flex items-center justify-center px-6 md:px-16 py-12">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <h1 className="text-2xl font-semibold text-gray-900">
              Update your password
            </h1>
            <p className="text-sm text-gray-500 mt-2 mb-8">
              Verify your identity using the OTP and create a new secure
              password.
            </p>

            <form onSubmit={onSubmit}>
              {/* OTP */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  One-Time Password (OTP)
                </label>

                <div className="relative">
                  <KeyIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    name="otp"
                    placeholder="6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,6}$/.test(value)) {
                        setFormData({ ...formData, otp: value });
                      }
                    }}
                    required
                    maxLength={6}
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  OTP must be numeric and 6 digits long
                </p>
              </div>

              {/* New Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New password
                </label>

                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Create a new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />

                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>

                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />

                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={isSubmitting}
                type="submit"
                className={`w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center transition
          ${
            isSubmitting
              ? "bg-indigo-400 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
              >
                {isSubmitting ? "Updating password…" : "Update password"}
              </button>

              {/* Footer */}
              <p className="text-sm text-gray-600 mt-6 text-center">
                Back to{" "}
                <Link
                  to="/signin"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
