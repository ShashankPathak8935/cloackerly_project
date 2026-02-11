import React, { Suspense, lazy } from "react";
import {
  Outlet,
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoginProtector, RoutesProtector } from "./routesProtector";
import UpdatePassword from "../auth/updatePassword";
import DashboardGuard from "./DashboardGuard";

// ✅ Lazy imports
const LandingPage = lazy(() => import("../pages/home.jsx/landingPage"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const Campaign = lazy(() => import("../pages/campaignCreation"));
const CloakingIntegration = lazy(() => import("../pages/CampaignIntegration"));
const IpListings = lazy(() => import("../pages/IpListings"));
const Analytics = lazy(() => import("../pages/Analytics"));
const SignupPage = lazy(() => import("../auth/SignUpForm"));
const LoginPage = lazy(() => import("../auth/SignInForm"));
const Impersonate = lazy(() => import("../auth/ImpersonateRoute"));
const Success = lazy(() => import("../pages/success"));
const PaymentCancel = lazy(() => import("../pages/cancel"));
const Test = lazy(() => import("../pages/test"));
// const ClickLogs = lazy(() => import("../pages/clickLogs"));
const AllCampaignsDashboard = lazy(() => import("../pages/AllCampaign"));
const AllStats = lazy(() => import("../pages/AllStats"));
const Pricing = lazy(() => import("../pages/Pricing"));
const MyProfile = lazy(() => import("../pages/MyProfile"));
const Clicklog = lazy(() => import("../pages/clickLogs1"));
const CheckoutFlow = lazy(() => import("../components/ui/checkOutFlow"));
const ResetPassword = lazy(() => import("../auth/ResetPassword"));
// const UpdatePassword = lazy(() => import("../auth/updatePassword"));
const RealtimeAnalytics = lazy(() => import("../pages/RealtimeAnalytics"));
const Socket = lazy(() => import("../pages/socket"));
const PaypalIntegration = lazy(() => import("../pages/paypalIntegration"));
const Billing = lazy(() => import("../pages/Billing"));
const Verifyotp = lazy(() => import("../auth/VerifyOtp"));

const Layout = () => (
  <div className="w-[100vw] h-[100vh] bg-[#0b0d14]">
    <Outlet />
  </div>
);

// ✅ Simple loading spinner (you can replace it with skeleton or spinner component)
const Loader = () => (
  <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white">
    <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-sky-200/80 blur-3xl" />
    <div className="pointer-events-none absolute -right-20 bottom-6 h-80 w-80 rounded-full bg-blue-200/80 blur-3xl" />
    <div className="pointer-events-none absolute inset-0 bg-white/45 backdrop-blur-xl" />

    <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-8 py-10">
      <img
        src="/logo-new.png"
        alt="Clockerly logo"
        className="h-52 w-52 object-contain drop-shadow-[0_12px_30px_rgba(2,6,23,0.2)] animate-[heartbeat_1.8s_ease-in-out_infinite] md:h-64 md:w-64"
      />
      <p className="text-[13px] font-semibold tracking-[0.28em] text-slate-600">
        LOADING
      </p>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-600" />
      </div>
    </div>
    <style>
      {`@keyframes heartbeat {
        0% { transform: scale(1); }
        14% { transform: scale(1.08); }
        28% { transform: scale(1); }
        42% { transform: scale(1.1); }
        70% { transform: scale(1); }
        100% { transform: scale(1); }
      }`}
    </style>
  </div>
);

export default function Routess() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/socket" element={<Socket />} />
          <Route path="/paypal" element={<PaypalIntegration />} />
          <Route path="/impersonate" element={<Impersonate />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<PaymentCancel />} />

          {/* Guest Only Routes */}
          <Route
            path="/signin"
            element={
              <LoginProtector>
                <LoginPage />
              </LoginProtector>
            }
          />
          <Route
            path="/signup"
            element={
              <LoginProtector>
                <SignupPage />
              </LoginProtector>
            }
          />
          <Route
            path="/reset-password"
            element={
              <LoginProtector>
                <ResetPassword />
              </LoginProtector>
            }
          />

          <Route
            path="/update-password"
            element={
              <LoginProtector>
                <UpdatePassword />
              </LoginProtector>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <LoginProtector>
                <Verifyotp />
              </LoginProtector>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/Dashboard"
            element={
              <RoutesProtector>
                <DashboardGuard>
                <Dashboard />
                </DashboardGuard>
              </RoutesProtector>
            }
          >
            <Route path="allStats" element={<AllStats />} />
            <Route path="allCampaign" element={<AllCampaignsDashboard />} />
            <Route path="create-campaign" element={<Campaign />} />
            <Route
              path="campaign-integration"
              element={<CloakingIntegration />}
            />
            <Route path="ipListings" element={<IpListings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="test" element={<Test />} />
            {/* <Route path="clickLogs" element={<ClickLogs />} /> */}

            <Route path="reports" element={<Clicklog />} />
            <Route
              path="real-time-analytics/:id"
              element={<RealtimeAnalytics />}
            />
            <Route path="pricing" element={<Pricing />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          <Route
            path="/myProfile"
            element={
              <RoutesProtector>
                {" "}
                <MyProfile />
              </RoutesProtector>
            }
          />

          <Route
            path="/pricing"
            element={
              <RoutesProtector>
                {" "}
                <CheckoutFlow />
              </RoutesProtector>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 99999,
          },
        }}
      />
    </Router>
  );
}
