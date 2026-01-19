import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaClipboardList,
  FaHeadset,
  FaRegChartBar,
  FaBox,
  FaRegCreditCard,
  FaRegUser,
  FaLifeRing,
} from "react-icons/fa";

import { AccountDetailsForm } from "../components/ui/MyProfile/AccountDetailsForm";
import { OrdersView } from "../components/ui/MyProfile/OrdersView";
import { SubscriptionView } from "../components/ui/MyProfile/SubscriptionView";
import { SupportTicketsView } from "../components/ui/MyProfile/SupportTicketsView";

import { useNavigate } from "react-router-dom";
import { apiFunction } from "../api/ApiFunction";
import { signOutApi } from "../api/Apis";

const MyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState(null);

  // Load user AFTER component mounts
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored)); // ⬅️ FIX
    }
  }, []);

  const views = {
    orders: <OrdersView />,
    subscription: <SubscriptionView />,
    account: <AccountDetailsForm />,
    ticket: <SupportTicketsView />,
  };

  const breadcrumbNames = {
    account: "Account Details",
    orders: "My Orders",
    subscription: "My Subscription",
    ticket: "Support Tickets",
  };

  const handleLogout = async () => {
    try {
      const res = await apiFunction("get", signOutApi, null, null);
      if (res) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-gray-800 px-8 py-10">
      {/* PAGE TITLE */}
      {/* <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-slate-400 mt-1">
          Home /{" "}
          <span className="text-blue-500">{breadcrumbNames[activeTab]}</span>
        </p>
      </div> */}

      {/* GRID */}
      <div className="grid grid-cols-12 gap-8">
        {/* SIDEBAR */}
        <aside className="col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6 shadow-sm">
            {/* USER */}
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full bg-blue-400 text-white
            flex items-center justify-center font-semibold text-sm"
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-slate-400">Member</p>
              </div>
            </div>

            {/* NAV */}
            <div className="border-t border-slate-200 pt-4 space-y-1">
              <SidebarItem
                title="Overview"
                icon={<FaRegChartBar />}
                onClick={() => navigate("/Dashboard/allStats")}
              />

              <SidebarItem
                title="Orders"
                icon={<FaBox />}
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
              />

              <SidebarItem
                title="Plan & Billing"
                icon={<FaRegCreditCard />}
                active={activeTab === "subscription"}
                onClick={() => setActiveTab("subscription")}
              />

              <SidebarItem
                title="Profile Settings"
                icon={<FaRegUser />}
                active={activeTab === "account"}
                onClick={() => setActiveTab("account")}
              />

              <SidebarItem
                title="Help Center"
                icon={<FaLifeRing />}
                active={activeTab === "ticket"}
                onClick={() => setActiveTab("ticket")}
              />
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition pt-3 border-t border-slate-200"
            >
              <FaSignOutAlt /> Sign out
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="col-span-9">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm min-h-[400px]">
            {views[activeTab]}
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ title, icon, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition
      ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-slate-500 hover:bg-slate-100"
      }`}
  >
    <span className="text-[15px]">{icon}</span>
    <span>{title}</span>
  </div>
);

export default MyProfile;
