// SignupPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";
import { createApiFunction } from "../api/ApiFunction";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import { signupApi } from "../api/Apis";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/\d/, "At least one number")
    .matches(/[@$!%*?&#]/, "At least one special character"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions",
  ),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // ✅ Submit
  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await createApiFunction(
        "post",
        signupApi,
        null,
        payload,
      );

      if (response?.data?.success === true) {
        showSuccessToast("Enter Otp to Verify your mail!");

        localStorage.setItem(
          "signup_data",
          JSON.stringify({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
          }),
        );

        reset();
        navigate("/verify-otp");
      } else {
        showErrorToast(
          response?.message || "Something went wrong. Please try again.",
        );
      }

      // if (response?.status === 201 || response?.success) {
      //   showSuccessToast("Account created successfully!");
      //   reset();
      //   navigate("/signin");
      // } else {
      //   showErrorToast(
      //     response?.message || "Something went wrong. Please try again.",
      //   );
      // }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again later.";
      showErrorToast(message);
    } finally {
      setLoading(false);
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
      <div className="w-full xl:w-1/2 bg-gradient-to-br from-white to-gray-50 flex flex-col justify-center px-10 md:px-20 py-12 shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create your Account
        </h1>
        <p className="text-gray-500 mb-8">Create an account to get started!</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon className="w-5 h-5" />
                </span>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="Enter your first name"
                  className={`h-11 w-full pl-10 rounded-xl border px-3 py-2 text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition shadow-sm ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-indigo-200"
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon className="w-5 h-5" />
                </span>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Enter your last name"
                  className={`h-11 w-full pl-10 rounded-xl border px-3 py-2 text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition shadow-sm ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-indigo-200"
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <EnvelopeIcon className="w-5 h-5" />
              </span>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                className={`h-11 w-full pl-10 rounded-xl border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition shadow-sm ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LockClosedIcon className="w-5 h-5" />
              </span>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                className={`h-11 w-full pl-10 rounded-xl border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition shadow-sm ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LockClosedIcon className="w-5 h-5" />
              </span>
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                className={`h-11 w-full pl-10 rounded-xl border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition shadow-sm ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              {...register("terms")}
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
              .
              {errors.terms && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.terms.message}
                </div>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 flex items-center justify-center gap-2 rounded-xl font-semibold text-white transition shadow-lg ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>

          <p className="text-sm text-gray-600 mt-3 text-center">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
