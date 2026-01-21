import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Target,
  ShieldX,
  BarChart3,
  FileText,
  DollarSign,
  Wallet,
} from "lucide-react";

// import { useSelector } from "react-redux";

const SidebarContent = ({ isCollapsed, mobileVisible, onCloseMobile }) => {
  const location = useLocation();
  const [databaseOpen, setDatabaseOpen] = useState(false);
  const showFull = !isCollapsed;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const { employer } = useSelector((state) => state.getDataReducer);
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard />,
      route: "/Dashboard/allStats",
    },
    {
      label: "Campaigns",
      icon: <Target />,
      route: "/Dashboard/allCampaign",
    },

    {
      label: "Blocked Traffic",
      icon: <ShieldX />,
      route: "/Dashboard/IpListings",
    },
    {
      label: "Insights",
      icon: <BarChart3 />,
      route: "/Dashboard/analytics",
    },
    {
      label: "Traffic Logs",
      icon: <FileText size={18} />,
    },
    {
      label: "Subscriptions",
      icon: <DollarSign size={18} />,
      route: "/Dashboard/pricing",
    },
    {
      label: "Payments",
      icon: <Wallet size={18} />,
      route: "/Dashboard/billing",
    },
  ];

  const databaseSubItems = [
    {
      label: "Click Logs",
      route: "/Dashboard/reports",
    },
  ];

  const handleNavigate = (route) => {
    navigate(route);
    if (mobileVisible) onCloseMobile(); // auto-close sidebar on mobile
  };

  const isDatabaseActive = databaseSubItems.some(
    (sub) => location.pathname === sub.route,
  );

  return (
    <div
      className={`
    h-full flex flex-col py-4 px-2
    bg-transparent
    ${isCollapsed ? "w-16" : "w-60"}
    transition-all duration-500 ease-in-out mt-4
  `}
    >
      {/* Logo & Avatar */}
      <div
        className={`px-2 mb-0 flex items-center ${
          showFull ? "gap-3" : "justify-center"
        }`}
      >
        {/* {user?.company?.logoUrl ? (
          <img
            src={employer?.company.logoUrl}
            alt="Logo"
            className="w-9 h-9 rounded-xl object-cover border border-gray-200"
          />
        ) : (
          <div
            className="mt-3
        w-9 h-9 rounded-xl
        bg-blue-500 text-white
        flex items-center justify-center
        text-sm font-semibold
      "
          >
            {user?.name.charAt(0).toUpperCase()}
          </div>
        )} */}
        {/* {showFull && (
          <p className="mt-3 text-sm font-semibold text-gray-900 truncate">
            {user?.name}
          </p>
        )} */}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-gray-700">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.route;
          const isDatabase = item.label === "Traffic Logs";
          const isItemActive = isActive || (isDatabase && isDatabaseActive);

          return (
            <div key={index}>
              <div
                id={item.label}
                onClick={() => {
                  if (isDatabase) {
                    setDatabaseOpen(!databaseOpen);
                  } else if (item.route) {
                    handleNavigate(item.route);
                  }
                }}
                className={`
              flex items-center justify-between
              px-3 py-1 rounded-xl cursor-pointer
              transition-all
              ${
                isItemActive
                  ? "bg-emerald-50 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }
            `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      isItemActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {showFull && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
                {isDatabase && showFull && (
                  <span className="text-gray-400">
                    {databaseOpen ? (
                      <ChevronUp size={16} className="text-emerald-600" />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {isDatabase && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    databaseOpen && showFull ? "max-h-96 mt-1" : "max-h-0"
                  }`}
                >
                  <div className="ml-6 flex flex-col gap-1">
                    {databaseSubItems.map((sub, subIndex) => {
                      const isSubActive = location.pathname === sub.route;
                      return (
                        <div
                          key={subIndex}
                          onClick={() => handleNavigate(sub.route)}
                          className={`
                        flex items-center gap-2
                        px-3 py-2 rounded-lg text-sm cursor-pointer
                        transition-all
                        ${
                          isSubActive
                            ? "bg-emerald-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                        >
                          <span
                            className={`${
                              isSubActive ? "text-blue-600" : "text-gray-400"
                            }`}
                          >
                            {sub.icon}
                          </span>
                          <span>{sub.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

const Sidebar = ({ collapsed, mobileVisible, onCloseMobile }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:block "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`
      h-[100vh] mt-[-8vh]
      bg-white backdrop-blur-2xl
      border-r border-gray-100/60
      shadow-[1px_0_0_rgba(0,0,0,0.04)]
      ${collapsed && !hovered ? "w-16" : "w-60"}
      transition-all duration-[600ms]
      ease-[cubic-bezier(.22,.61,.36,1)]
    `}
        >
          <div className="h-full flex mt-[10vh] flex-col justify-end">
            <SidebarContent
              isCollapsed={collapsed && !hovered}
              mobileVisible={mobileVisible}
              onCloseMobile={onCloseMobile}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileVisible && (
        <div className="absolute inset-0 z-50 flex md:hidden">
          <div
            className="
        w-64 h-[100vh]
        bg-white
        border-r border-gray-200
        shadow-[0_30px_80px_rgba(0,0,0,0.25)]
        py-2 overflow-hidden
      "
          >
            <div className="h-full flex flex-col justify-end">
              <SidebarContent isCollapsed={false} />
            </div>
          </div>

          <div
            className="flex-1 bg-black/30 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
