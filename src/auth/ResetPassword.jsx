import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createApiFunction } from "../api/ApiFunction";
import { forgotPassword } from "../api/Apis";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../components/toast/toast";
import { motion } from "framer-motion";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function ResetPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Function
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await createApiFunction("post", forgotPassword, null, {
        email: formData.email,
      });
      localStorage.setItem("resetEmail", formData.email);

      showSuccessToast(res?.data?.message || "OTP Sent");
      navigate("/update-password");
    } catch (err) {
      console.error(err);
      showErrorToast(
        err.response?.data?.message ||
          "Something went wrong! Please try again.",
      );
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
              Reset your password
            </h1>
            <p className="text-sm text-gray-500 mt-2 mb-8">
              Enter the email associated with your account and we’ll send you a
              one-time password (OTP) to reset it.
            </p>

            <form onSubmit={onSubmit}>
              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="email"
                    name="email"
                    autoComplete="off"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Please enter a valid email address",
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={isSubmitting}
                type="submit"
                className={`w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition
          ${
            isSubmitting
              ? "bg-indigo-400 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Sending OTP…
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>

              {/* Footer */}
              <p className="text-sm text-gray-600 mt-6 text-center">
                Remembered your password?{" "}
                <Link
                  to="/signin"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Back to sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
