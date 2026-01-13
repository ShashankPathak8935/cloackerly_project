import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiFunction } from "../api/ApiFunction";
import { blacklistIpApi } from "../api/Apis";
import { showSuccessToast, showErrorToast } from "../components/toast/toast";

const BlacklistedIPsPage = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onViewAll,
  onPrevious,
  onNext,
  onAddIp,
  onRefresh,
}) => {
  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  const RefreshIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4 4a8 8 0 1111.31 6.9l1.39 1.39a1 1 0 01-1.42 1.42l-2.83-2.83A1 1 0 0113 9h3a6 6 0 10-6 6v-2a1 1 0 012 0v3a1 1 0 01-1 1H8a8 8 0 01-4-13z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Reusable Button
  const Button = ({ children, variant, icon: Icon, onClick }) => {
    let classes =
      "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    if (variant === "primary") {
      classes += " bg-blue-600 hover:bg-blue-700 text-white shadow-md";
    } else if (variant === "secondary") {
      classes +=
        " bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600";
    } else if (variant === "pagination") {
      classes +=
        " bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
    }

    return (
      <button className={classes} onClick={onClick}>
        {Icon && <Icon />}
        {children}
      </button>
    );
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const [openIpModal, setOpenIpModal] = useState(false);
  const [ipList, setIpList] = useState("");
  // ✅ ONLY ONCE
  const [ips, setIps] = useState([]);
  const [loadingIps, setLoadingIps] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const TrashIcon = ({ onClick }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-500 hover:text-red-400 cursor-pointer"
      viewBox="0 0 20 20"
      fill="currentColor"
      onClick={onClick}
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
        clipRule="evenodd"
      />
    </svg>
  );

  const isValidIPv4 = (ip) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return ipv4Regex.test(ip);
  };

  const isValidIPv6 = (ip) => {
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
    return ipv6Regex.test(ip);
  };

  const isValidIP = (ip) => isValidIPv4(ip) || isValidIPv6(ip);

  const addBlacklistedIps = async (rawText) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      if (!userId) {
        showErrorToast("User not logged in");
        return;
      }

      const ipArray = rawText
        .split("\n")
        .map((ip) => ip.trim())
        .filter((ip) => ip.length > 0);

      if (ipArray.length === 0) {
        showErrorToast("Please enter at least one IP");
        return;
      }

      // 🚫 STRICT VALIDATION
      const invalidIps = ipArray.filter((ip) => !isValidIP(ip));

      if (invalidIps.length > 0) {
        showErrorToast(`Invalid IP(s): ${invalidIps.join(", ")}`);
        return; // ❌ STOP SUBMIT
      }

      // ✅ All IPs valid → proceed
      for (const ip of ipArray) {
        const payload = {
          userId,
          IPAddress: ip,
        };
        await apiFunction("post", blacklistIpApi, null, payload);
        await fetchBlacklistedIps();
      }

      showSuccessToast(`${ipArray.length} IP(s) added successfully`);
      setIpList("");
      setOpenIpModal(false);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to add IP(s)");
    }
  };

  const fetchBlacklistedIps = async () => {
    try {
      setLoadingIps(true);

      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      if (!userId) {
        showErrorToast("User not logged in");
        return;
      }

      const res = await apiFunction(
        "get",
        `${blacklistIpApi}?userId=${userId}`,
        null,
        null
      );

      const rawData = res?.data || [];

      const formatted = rawData.map((item, index) => ({
        sn: index + 1,
        ip: item.IPAddress || "-",
        addedOn: item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-IN")
          : "-",
        id: item.id,
      }));

      setIps(formatted);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to fetch IPs");
    } finally {
      setLoadingIps(false);
    }
  };

  const deleteBlacklistedIp = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this IP?"
      );

      if (!confirmDelete) return;

      await apiFunction("delete", blacklistIpApi, id, null);

      showSuccessToast("IP deleted successfully");

      // 🔁 refresh list OR local remove
      setIps((prev) => prev.filter((ip) => ip.id !== id));
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to delete IP");
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      await fetchBlacklistedIps();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // smooth finish
    }
  };

  useEffect(() => {
    fetchBlacklistedIps();
  }, []);

  return (
    <div
      style={{ fontFamily: "Outfit, sans-serif" }}
      className="min-h-screen bg-gray-50 px-8 py-10 text-gray-800"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Blocked IP Addresses
            </h1>
            {/* <p className="text-sm text-gray-500 mt-1 max-w-xl">
              Manage, add or remove blacklisted IP addresses with ease
            </p> */}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenIpModal(true)}
              className="
        flex items-center gap-2 px-5 py-2.5
        rounded-full text-sm font-medium
        bg-blue-600 text-white
        hover:bg-blue-700
        shadow-md transition
      "
            >
              <span className="text-lg leading-none">+</span>
              Add IP
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`
        flex items-center gap-2 px-5 py-2.5
        rounded-full text-sm font-medium
        border border-gray-300
        bg-white
        hover:bg-gray-100
        shadow-sm transition
        ${isRefreshing && "opacity-60 cursor-not-allowed"}
      `}
            >
              <svg
                className={`h-4 w-4 ${isRefreshing && "animate-spin"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[60px_1fr_180px_120px] px-6 py-4 bg-blue-50 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <div>SN</div>
            <div>IP Address</div>
            <div>Added On</div>
            <div className="text-center">Action</div>
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto">
            {!loadingIps &&
              ips.map((ip) => (
                <div
                  key={ip.id}
                  className="
          grid grid-cols-[60px_1fr_180px_120px]
          px-6 py-3 text-sm
          border-t border-gray-100
          hover:bg-gray-50
          transition
        "
                >
                  <div className="text-gray-500">{ip.sn}</div>

                  {/* 🔥 IP COLUMN FIX */}
                  <div className="font-mono truncate" title={ip.ip}>
                    {ip.ip}
                  </div>

                  <div className="text-gray-500">{ip.addedOn}</div>

                  <div className="flex justify-center">
                    <TrashIcon
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                      onClick={() => deleteBlacklistedIp(ip.id)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {openIpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Modal Box */}
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Blacklisted IPs
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add one or multiple IPs (one per line)
                </p>
              </div>

              {/* Close Icon */}
              <button
                onClick={() => setOpenIpModal(false)}
                className="text-gray-400 hover:text-gray-600 transition text-xl"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <textarea
                value={ipList}
                onChange={(e) => setIpList(e.target.value)}
                rows={4}
                placeholder="e.g. 240.4.91.158"
                className="
            w-full resize-none rounded-lg
            border border-gray-300
            bg-white px-4 py-3
            text-sm text-gray-800
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
              />

              <div className="text-xs text-gray-500 space-y-1">
                <div>Examples:</div>
                <div className="font-mono text-gray-400">
                  240.4.91.158 <br />
                  115546 <br />
                  6b5d:4417:cee5:9676:6926:b272:d8ae:f9e6
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setOpenIpModal(false)}
                className="
            px-4 py-2 rounded-lg
            text-sm font-medium
            text-gray-600
            hover:bg-gray-200
            transition
          "
              >
                Cancel
              </button>

              <button
                onClick={() => addBlacklistedIps(ipList)}
                className="
            px-5 py-2 rounded-lg
            text-sm font-medium
            bg-blue-600 text-white
            hover:bg-blue-700
            shadow-sm
            transition
          "
              >
                Add IPs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlacklistedIPsPage;
