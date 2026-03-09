import React, { useEffect, useCallback, useState } from "react";

import {
  addUrlCampData,
  getAllCampaign,
  getAllAnalyticsCamp,
  javascriptIntegrationCheckApi,
} from "../api/Apis";
import { apiFunction } from "../api/ApiFunction";
import { useNavigate } from "react-router-dom";

import { showErrorToast, showSuccessToast } from "../components/toast/toast";

const WebAnalyticsPage = ({
  analyticsData = [],
  currentPage,
  itemsPerPage,
  onViewAll,
  onPrevious,
  onNext,
  onAddNewUrl,
  onRefresh,
  onViewClick,
  onCodeClick,
  onDeleteClick,
}) => {
  // MODAL STATES
  const [open, setOpen] = useState(false);
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [selectedCdnCode, setSelectedCdnCode] = useState({});
  const navigate = useNavigate();

  const Button = ({
    children,
    variant,
    icon: Icon,
    onClick,
    className = "",
  }) => {
    let baseClasses =
      "px-4 py-2 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2 focus:outline-none";

    if (variant === "primary") {
      baseClasses += " bg-blue-600 hover:bg-blue-700 text-white shadow-md";
    } else if (variant === "secondary") {
      baseClasses +=
        " bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600";
    } else if (variant === "pagination") {
      baseClasses +=
        " bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
    } else if (variant === "icon") {
      baseClasses =
        "p-2 rounded-lg bg-transparent hover:bg-[#25344E] transition-all duration-200";
    }

    return (
      <button className={`${baseClasses} ${className}`} onClick={onClick}>
        {Icon && <Icon />}
        {children}
      </button>
    );
  };

  const TrashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
        clipRule="evenodd"
      />
    </svg>
  );

const BracketsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 18l6-6-6-6M8 6l-6 6 6 6"
    />
  </svg>
);

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-blue-500 block"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5
         c4.477 0 8.268 2.943 9.542 7
         -1.274 4.057-5.065 7-9.542 7
         -4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const [campaigns, setCampaigns] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [urlName, setUrlName] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiFunction(
        "get",
        getAllAnalyticsCamp,
        null,
        null,
      );
      console.log(response);

      const dataRows = response.data.data || [];

      setCampaigns(dataRows);
      setTotalItems(dataRows.length);
    } catch (err) {
      setError("Failed to load campaigns");
    } finally {
      setIsLoading(false); // Stop loading
    }
  }, []);

  const handleDeleteCampaign = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this campaign?",
    );
    if (!confirmDelete) return;

    try {
      const res = await apiFunction(
        "delete",
        getAllAnalyticsCamp,
        id, // 👈 ID here
        null,
      );

      showSuccessToast("Campaign deleted successfully");

      // 🔄 Refresh list after delete
      fetchCampaigns();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to delete campaign",
      );
    }
  };

  const addUrlCamp = async () => {
    // basic validation
    if (!urlName.trim() || !urlValue.trim()) {
      showErrorToast("Name and URL are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: urlName,
        integrationUrl: urlValue,
      };

      const res = await apiFunction("post", getAllAnalyticsCamp, null, payload);

      if (res?.data?.success) {
        // reset fields
        setUrlName("");
        setUrlValue("");

        // close modal
        setOpen1(false);

        // refresh list
        fetchCampaigns();
        showSuccessToast("Campaign Created Successfully..!!");
      }
    } catch (error) {
      showErrorToast("Failed to add URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleRefresh = () => {
    fetchCampaigns();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedCdnCode);
      setIsCopied(true);
      showSuccessToast("Code copied to clipboard!");

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      showErrorToast("Failed to copy. Try again.");
    }
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // integration check
  const javascriptIntegration = async (camp) => {
    // console.log("ghfdu", camp?.selectedCdnCode?.item);
    const item = camp?.selectedCdnCode?.item;
    const url = item?.integrationUrl;
    const data = {
      url: url, // client site URL
      campId: item?.id, // expected camp id
    };
    const res = await apiFunction(
      "post",
      javascriptIntegrationCheckApi,
      null,
      data,
    );
    console.log(res);

    if (res.status === 200) {
      const data = {
        integration: true,
      };
      try {
        console.log("guhsuhuahu");

        const integrate = await apiFunction(
          "patch",
          getAllAnalyticsCamp,
          item?.id,
          data,
        );
        console.log(integrate);
      } catch (error) {
        console.log("error", error);
      }

      showSuccessToast("✅ Integration Successful");
    } else {
      showErrorToast("❌ Integration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Web Analytics
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Track your URLs and monitor real-time visitor data
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setOpen1(true)}
              className="flex items-center px-4 py-2 bg-blue-400 hover:bg-blue-700 rounded-xl font-medium text-sm shadow-lg transition duration-150 cursor-pointer"
            >
              <svg
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add URL
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading} // Disable button while fetching
              className={`flex items-center cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-400 rounded-xl font-medium text-sm shadow-lg transition duration-150 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className={`h-5 w-5 mr-2 ${isLoading ? "animate-spin" : ""}`} // Spinning animation
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isLoading ? "Reloading..." : "Reload"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          style={{ fontFamily: "Inter, Outfit, system-ui, sans-serif" }}
          className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden"
        >
          {/* TABLE HEADER */}
          <div
            className="
      grid grid-cols-8 gap-4
      px-8 py-4
      bg-gray-50
      border-b border-gray-200
      text-xs font-medium text-gray-500 uppercase tracking-wide
    "
          >
            <div>SN</div>
            <div>Name</div>
            <div>URL</div>
            <div>Total Visitors</div>
            <div>View</div>
            <div>Code</div>
            <div>Created</div>
            <div className="text-right">Actions</div>
          </div>

          {/* TABLE BODY */}
          {campaigns?.map((item, index) => (
            <div
              key={item.id}
              className="
        grid grid-cols-8 gap-4
        items-center
        px-8 py-2
        text-sm text-gray-700
        border-b border-gray-100
        hover:bg-gray-50 transition
      "
            >
              {/* SN */}
              <div className="text-gray-500">{index + 1}</div>

              {/* Name */}
              <div className="font-medium text-gray-900 truncate">
                {item?.name || "NA"}
              </div>

              {/* URL (tooltip same, just premium look) */}
              <div className="relative group inline-block">
                <span className="text-blue-600 cursor-pointer text-sm">ℹ️</span>

                <div
                  className="
            absolute z-[9999]
      bottom-full mb-2 left-0
      hidden group-hover:block
      bg-gray-900 text-white text-xs
      px-3 py-1.5 rounded-md
      shadow-xl
      whitespace-nowrap
      pointer-events-none
          "
                >
                  {item?.integrationUrl || "-"}
                </div>
              </div>

              {/* Visitors */}
              <div className="tabular-nums font-medium">
                {item?.clickCount || "0"}
              </div>

              {/* View */}
              <div>
                <Button
                  variant="icon"
                  icon={EyeIcon}
                  className="p-1.5 rounded-md hover:bg-gray-300 transition cursor-pointer"
                  onClick={() =>
                    navigate(`/Dashboard/real-time-analytics/${item.id}`)
                  }
                />
              </div>

              {/* Code */}
              <div>
                <button
                  onClick={() => {
                    setSelectedCdnCode({
                      item: item,
                      cdn: item?.integrationCode || "",
                      link: item?.integrationUrl || "",
                    });
                    setOpenCodeModal(true);
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-300 transition cursor-pointer"
                >
                  <BracketsIcon />
                </button>
              </div>

              {/* Created */}
              <div className="text-xs text-gray-600">
                {formatDateTime(item?.createdAt)}
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <Button
                  variant="icon"
                  className="p-1.5 rounded-md hover:bg-gray-300 transition cursor-pointer"
                  icon={TrashIcon}
                  onClick={() => handleDeleteCampaign(item.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
      </div>

      {/* CODE MODAL */}
      {openCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="w-[600px] bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Analytics Integration
                </h2>
                <p className="text-xs text-gray-500">
                  Add this script to your website
                </p>
              </div>

              <button
                onClick={() => setOpenCodeModal(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-6">
              {/* Code Section */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Script Code
                </label>

                <div className="mt-2 relative bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-mono">
                  <pre className="whitespace-pre-wrap max-h-32 overflow-auto">
                    {selectedCdnCode?.cdn}
                  </pre>
                </div>

                <button
                  onClick={handleCopyCode}
                  className={`mt-3 inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm rounded-lg transition shadow-sm
              ${
                isCopied
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }
            `}
                >
                  {isCopied ? "Copied successfully" : "Copy script"}
                </button>
              </div>

              {/* URL Test */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Test URL
                </label>

                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-mono">
                  <pre className="whitespace-pre-wrap max-h-24 overflow-auto">
                    {selectedCdnCode?.link}
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setOpenCodeModal(false)}
                className="px-4 py-2 text-sm cursor-pointer rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => javascriptIntegration({ selectedCdnCode })}
                className="px-5 py-2 cursor-pointer text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
              >
                Test Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {open1 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">
          {/* SOFT GLOW */}
          <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-3xl"></div>

          {/* MODAL */}
          <div
            style={{ fontFamily: "Inter, Outfit, system-ui, sans-serif" }}
            className="
        relative w-full max-w-xl
        rounded-3xl bg-white
        shadow-[0_40px_120px_rgba(0,0,0,0.25)]
        border border-gray-200
        p-10
        text-gray-900
      "
          >
            {/* HEADER */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight">
                Add Destination URL
              </h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Securely configure and track your campaign destination.
              </p>
            </div>

            {/* INPUTS */}
            <div className="space-y-7">
              {/* NAME */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
                  Campaign Name
                </label>
                <input
                  value={urlName}
                  onChange={(e) => setUrlName(e.target.value)}
                  placeholder="PPC Offer Page"
                  className="
              w-full px-5 py-4 rounded-xl
              bg-gray-50
              border border-gray-300
              text-sm
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
              focus:border-blue-500
              transition
            "
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
                  Destination URL
                </label>
                <input
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://example.com"
                  className="
              w-full px-5 py-4 rounded-xl
              bg-gray-50
              border border-gray-300
              text-sm
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
              focus:border-blue-500
              transition
            "
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-12 flex items-center justify-end gap-5">
              <button
                onClick={() => setOpen1(false)}
                className="
            text-sm font-medium text-gray-500
            hover:text-gray-900
            transition
          "
              >
                Cancel
              </button>

              <button
                onClick={addUrlCamp}
                disabled={isSubmitting}
                className={`
            px-7 py-4 rounded-xl
            text-sm font-semibold
            text-white
            shadow-[0_16px_40px_rgba(37,99,235,0.35)]
            transition-all
            ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600"
            }
          `}
              >
                {isSubmitting ? "Adding…" : "Add URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebAnalyticsPage;
