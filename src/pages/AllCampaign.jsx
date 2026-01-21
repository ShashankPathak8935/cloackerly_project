import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart3,
  PlayCircle,
  ShieldCheck,
  ShieldX,
  Edit3,
  Copy,
  Trash2,
} from "lucide-react";
import {
  createCampaignApi,
  getAllCampaign,
  ipClicks,
  campdata,
  updateCampaignStatus,
} from "../api/Apis";
import { apiFunction } from "../api/ApiFunction";
import { useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../components/toast/toast";

// Note: TABS definition is kept here for reference

function AllCampaignsDashboard() {
  // --- Existing State ---

  const [dateRange, setDateRange] = useState("d/m/y to d/m/y");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const ITEMS_PER_PAGE = 5;

  const [clickSummary, setClickSummary] = useState({
    totalClicks: 0,
    safeClicks: 0,
    moneyClicks: 0,
  });

  const [stats, setStats] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    blocked_campaigns: 0,
    allowed_campaigns: 0,
  });

  // ⭐ NEW STATE for Dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);

  // ⭐ useRef for Click Outside logic
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // --- API Fetch Function (Unchanged, except for the console.log) ---
  const fetchCampaigns = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunction(
        "get",
        `${getAllCampaign}?page=${page}&limit=${ITEMS_PER_PAGE}`,
        null,
        null
      );

      // Assume total items is available in response.data.total or we use array length
      const dataRows = response.data.data || [];
      console.log(dataRows);

      setCampaigns(dataRows);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.totalRecords);
      setTotalItems(response.data.total || dataRows.length);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load campaign data.";
      setError(errorMessage); // Updated to show actual error if available
      setIsLoading(false);
      setCampaigns([]);
      setTotalItems(0);
    }
  }, []);

  const fetchIpClicks = async () => {
    try {
      setLoading(true);

      const res = await apiFunction("get", ipClicks, null, null);
      const rawData = res?.data?.data || [];

      const formattedData = rawData.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        Safe: Number(item.total_s_clicks || 0),
        Money: Number(item.total_m_clicks || 0),
        Total: Number(item.total_t_clicks || 0),
      }));

      setChartData(formattedData);

      const totals = rawData.reduce(
        (acc, item) => {
          acc.totalClicks += Number(item.total_t_clicks || 0);
          acc.safeClicks += Number(item.total_s_clicks || 0);
          acc.moneyClicks += Number(item.total_m_clicks || 0);
          return acc;
        },
        { totalClicks: 0, safeClicks: 0, moneyClicks: 0 }
      );

      setClickSummary(totals);
    } catch (err) {
      console.error("IP Click API Error:", err);
      setChartData([]);
      setClickSummary({ totalClicks: 0, safeClicks: 0, moneyClicks: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await apiFunction("get", campdata, null, null);

      setStats({
        total_campaigns: res?.data?.data?.total_campaigns || 0,
        active_campaigns: res?.data?.data?.active_campaigns || 0,
        blocked_campaigns: res?.data?.data?.blocked_campaigns || 0,
        allowed_campaigns: res?.data?.data?.allowed_campaigns || 0,
      });
    } catch (error) {
      console.error("Stats API Error:", error);
    }
  };

  const handleStatusChange = async (uid, newStatus) => {
    try {
      // 🔎 current campaign find karo
      const currentItem = campaigns.find((item) => item.uid === uid);
      const oldStatus = currentItem?.status;

      // agar same status pe click hua to kuch mat karo
      if (!currentItem || oldStatus === newStatus) return;

      // ⏳ loading UI
      setCampaigns((prev) =>
        prev.map((item) =>
          item.uid === uid ? { ...item, statusLoading: true } : item
        )
      );

      const data = { status: newStatus };

      // 🔗 PATCH API
      const res = await apiFunction("patch", createCampaignApi, uid, data);

      if (!res?.data?.success) {
        showErrorToast("Failed updating status");
        return;
      }

      // ✅ update campaigns list
      setCampaigns((prev) =>
        prev.map((item) =>
          item.uid === uid
            ? { ...item, status: newStatus, statusLoading: false }
            : item
        )
      );

      // 🔥 UPDATE STATS WITHOUT RELOAD
      setStats((prev) => {
        const updated = { ...prev };

        // old status decrement
        if (oldStatus === "Active") updated.active_campaigns--;
        if (oldStatus === "Allow") updated.allowed_campaigns--;
        if (oldStatus === "Block") updated.blocked_campaigns--;

        // new status increment
        if (newStatus === "Active") updated.active_campaigns++;
        if (newStatus === "Allow") updated.allowed_campaigns++;
        if (newStatus === "Block") updated.blocked_campaigns++;

        return updated;
      });

      showSuccessToast(`Status updated ✔ : ${newStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      showErrorToast("Something went wrong!");

      // ❌ loading hatao
      setCampaigns((prev) =>
        prev.map((item) =>
          item.uid === uid ? { ...item, statusLoading: false } : item
        )
      );
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchIpClicks();
    fetchStats();
  }, [fetchCampaigns]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
        setDropdownPos(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this runs once

  // --- NEW Handlers for Dropdown ---
  const handleActionClick = (e, campaignId) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setDropdownPos({
      top: rect.bottom + 2, // below button
      left: rect.right - 150, // align right (w-48 = 192px)
    });
    setOpenDropdownId(openDropdownId === campaignId ? null : campaignId);
  };

  // const handleActionSelect = async (action, campaignId, row) => {
  //   setOpenDropdownId(null); // मेनू बंद करें
  //   switch (action) {
  //     case "edit":
  //       showInfoToast(`Editing campaign ID: ${campaignId}`);

  //       navigate("/Dashboard/create-campaign", {
  //         state: {
  //           mode: "edit",
  //           id: row.uid,
  //           data: row, // campaign data from db
  //         },
  //       });
  //       // TODO: Navigate to Edit screen or open a modal
  //       break;
  //     case "duplicate":
  //       // alert(`Duplicating campaign ID: ${campaignId}`);
  //       // TODO: Call API to duplicate campaign
  //       break;
  //     case "delete":
  //       if (window.confirm(`Are you sure you want to delete this campaign?`)) {
  //         const res = await apiFunction(
  //           "delete",
  //           createCampaignApi,
  //           campaignId,
  //           null
  //         );

  //         if (res) {
  //           setCampaigns((prev) =>
  //             prev.filter((item) => item.uid !== campaignId)
  //           );
  //         }
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // --- Existing Handlers ---
  
  const handleActionSelect = async (action, campaignId, row) => {
    setOpenDropdownId(null); // मेनू बंद करें
    switch (action) {
      case "edit":
        // alert(`Editing campaign ID: ${campaignId}`);
        navigate("/Dashboard/create-campaign", {
          state: {
            mode: "edit",
            id: row.uid,
            data: row, // campaign data from db
          },
        });
        // TODO: Navigate to Edit screen or open a modal
        break;
      case "duplicate": {
        try {
          if (!row) return;
          console.log(row);

          // 🔁 deep clone campaign
          const payload = JSON.parse(JSON.stringify(row));

          // ❌ backend generated fields hatao
          delete payload.uid;
          delete payload._id;
          delete payload.createdAt;
          delete payload.updatedAt;
          delete payload.date_time;

          // 📝 campaign name modify
          const data = {
            ...payload,

            campaignName:
              (payload.campaign_info?.campaignName || "Campaign") + " (Copy)",
            trafficSource: payload.campaign_info?.trafficSource,
          };

          // optional default status

          // 🚀 CREATE API CALL (same API as create)
          const res = await apiFunction("post", createCampaignApi, null, data);

          if (res?.data?.status || res?.data?.success) {
            const newCampaign = res.data.data;

            // ✅ UI update (top me add)
            setCampaigns((prev) => [newCampaign, ...prev]);

            showSuccessToast("Campaign duplicated successfully");
            await fetchCampaigns();
            await fetchStats();
          }
        } catch (err) {
          console.error("Duplicate campaign error:", err);
          showErrorToast("Failed to duplicate campaign");
        }

        break;
      }

      case "delete":
        if (window.confirm(`Are you sure you want to delete this campaign?`)) {
          const res = await apiFunction(
            "delete",
            createCampaignApi,
            campaignId,
            null
          );

          if (res) {
            setCampaigns((prev) =>
              prev.filter((item) => item.uid !== campaignId)
            );
            await fetchStats();
          }
        }
        break;
      default:
        break;
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);

      await Promise.all([fetchCampaigns(), fetchStats()]);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600); // smooth finish
    }
  };
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchCampaigns(page);
  };

  const MAX_VISIBLE_PAGES = 5;

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  const handleApplyFilter = () => {
    showInfoToast(
      `Applying filter: Search='${searchTerm}', Date='${dateRange}'. Refetching data...`
    );
  };

  const handleAddNewCampaign = () => {
    showInfoToast("Redirecting to Creating New Campaign");
    navigate("/Dashboard/create-campaign");
  };


    const ActionItem = ({ icon, label, onClick, danger }) => (
      <button
        onClick={onClick}
        className={`
        w-full flex items-center gap-3
        px-4 py-2.5
        text-sm text-left
        transition
        ${
          danger
            ? "text-red-500 hover:bg-red-50"
            : "text-slate-700 hover:bg-slate-100"
        }
      `}
      >
        <span
          className={`
          flex h-8 w-8 items-center justify-center
          rounded-md
          ${danger ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-600"}
        `}
        >
          {icon}
        </span>
  
        <span className="font-medium">{label}</span>
      </button>
    );
  
    const renderActionDropdown = (campaignId, row) => (
      <div
        className="
        fixed
        w-56
        rounded-xl
        bg-white/95 backdrop-blur-md
        border border-slate-200
        shadow-[0_12px_32px_rgba(15,23,42,0.15)]
        z-[9999999]
      "
        style={{
          left: dropdownPos.left,
          top: dropdownPos.top,
        }}
      >
        <div className="py-1">
          {/* EDIT */}
          <ActionItem
            icon={<Edit3 size={16} />}
            label="Edit campaign"
            onClick={() => handleActionSelect("edit", campaignId, row)}
          />
  
          {/* DUPLICATE */}
          <ActionItem
            icon={<Copy size={16} />}
            label="Duplicate campaign"
            onClick={() => handleActionSelect("duplicate", campaignId, row)}
          />
  
          {/* DIVIDER */}
          <div className="my-1 h-px bg-slate-100" />
  
          {/* DELETE */}
          <ActionItem
            danger
            icon={<Trash2 size={16} />}
            label="Delete campaign"
            onClick={() => handleActionSelect("delete", campaignId, null)}
          />
        </div>
      </div>
    );

  const TableColGroup = () => (
    <colgroup>
      <col className="w-12" />
      <col className="w-30" />
      <col className="w-30" />
      <col className="w-25" />
      <col className="w-32" />
      <col className="w-20" />
      <col className="w-16" />
      <col className="w-20" />
      <col className="w-48" />
      <col className="w-20" />
    </colgroup>
  );

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tbody>
          <tr>
            <td colSpan="10" className="text-center py-10 text-blue-400">
              Loading Campaigns...
            </td>
          </tr>
        </tbody>
      );
    }

    if (error || campaigns.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan="10" className="text-center py-10 text-gray-500">
              No campaigns found.
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-gray-100">
        {campaigns.map((item, index) => {
          const isDropdownOpen = openDropdownId === item?.uid;

          return (
            <tr
              key={item.uid}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              {/* SN */}
              <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>

              {/* Campaign Name */}
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {item.campaign_info?.campaignName}
              </td>

              {/* Source */}
              <td className="px-4 py-3 text-sm text-gray-600">
                {item.campaign_info?.trafficSource}
              </td>

              {/* STATUS */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Active */}
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Active")}
                    className={`p-1.5 rounded-md transition hover:bg-gray-100
                    ${
                      item.status === "Active"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                  `}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M7 4v16l13-8L7 4z" />
                    </svg>
                  </button>

                  {/* Allow */}
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Allow")}
                    className={`p-1.5 rounded-md transition hover:bg-gray-100
                    ${
                      item.status === "Allow"
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }
                  `}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M13 2L3 14h7v8l10-12h-7z" />
                    </svg>
                  </button>

                  {/* Block */}
                  <button
                    disabled={item.statusLoading}
                    onClick={() => handleStatusChange(item.uid, "Block")}
                    className={`p-1.5 rounded-md transition hover:bg-gray-100
                    ${
                      item.status === "Block" ? "text-red-500" : "text-gray-400"
                    }
                  `}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="5" y1="19" x2="19" y2="5" />
                    </svg>
                  </button>
                </div>
              </td>

              {/* Integration */}
              <td className="px-4 py-3 text-center">
                {item.integration ? (
                  <div className="relative group flex justify-center">
                    <svg
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded-lg shadow-lg whitespace-nowrap z-50">
                      {item.integrationUrl || "No URL Found"}
                    </div>
                  </div>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </td>

              {/* Clicks */}
              <td className="px-4 py-3 text-sm text-gray-700 text-center">
                {item?.campclicks?.total_t_clicks || 0}
              </td>

              {/* Safe */}
              <td className="px-4 py-3 text-sm text-gray-700 text-right">
                {item?.campclicks?.total_s_clicks || 0}
              </td>

              {/* Money */}
              <td className="px-4 py-3 text-sm text-gray-700 text-right">
                {item?.campclicks?.total_m_clicks || 0}
              </td>

              {/* Created */}
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(item.date_time).toLocaleString()}
              </td>

              {/* ACTION */}
              <td
                ref={isDropdownOpen ? dropdownRef : null}
                className="px-4 py-3 relative"
              >
                <button
                  onClick={(e) => handleActionClick(e, item?.uid)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition
                  ${isDropdownOpen ? "bg-gray-200 text-gray-800" : ""}
                `}
                >
                  ⋯
                </button>

                {isDropdownOpen && renderActionDropdown(item?.uid, item)}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* Header Section (Unchanged) */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            All Campaigns
            <span className="text-gray-400 font-medium ml-2">
              ({totalItems})
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage, monitor and control your campaigns
          </p>
        </div>

        <div className="flex gap-3">
          {/* ADD CAMPAIGN */}
          <button
            onClick={handleAddNewCampaign}
            className="
        inline-flex items-center gap-2
        px-5 py-2.5
        rounded-lg
        text-sm font-medium
        bg-blue-600 text-white
        hover:bg-blue-700
        shadow-[0_8px_24px_rgba(37,99,235,0.35)]
        transition-all
      "
          >
            <svg
              className="h-4 w-4"
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
            Add Campaign
          </button>

          {/* REFRESH */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
        inline-flex items-center gap-2
        px-5 py-2.5
        rounded-lg
        text-sm font-medium
        border border-gray-300
        bg-white text-gray-700
        hover:bg-gray-50
        shadow-sm
        transition
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
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      <h2 className="text-lg text-gray-800 mb-4">
        Create/Edit/Delete Campaigns
      </h2>

      {/* Filter and Control Bar (Unchanged) */}
      <div
        className="
    bg-white
    rounded-2xl
    border border-gray-200
    shadow-[0_20px_60px_rgba(0,0,0,0.06)]
    px-6 py-5
    mb-8
  "
      >
        {/* TABS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* TOTAL */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total Campaigns
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {stats.total_campaigns || 0}
            </p>
            <div className="mt-3 h-1 w-10 rounded-full bg-blue-600" />
          </div>

          {/* ACTIVE */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Live Campaigns
            </p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">
              {stats.active_campaigns || 0}
            </p>
            <div className="mt-3 h-1 w-10 rounded-full bg-emerald-500" />
          </div>

          {/* ALLOWED */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Allowed Traffic
            </p>
            <p className="mt-2 text-3xl font-semibold text-amber-500">
              {stats.allowed_campaigns || 0}
            </p>
            <div className="mt-3 h-1 w-10 rounded-full bg-amber-400" />
          </div>

          {/* BLOCKED */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Blocked Traffic
            </p>
            <p className="mt-2 text-3xl font-semibold text-red-500">
              {stats.blocked_campaigns || 0}
            </p>
            <div className="mt-3 h-1 w-10 rounded-full bg-red-500" />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="relative flex-grow max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search campaigns"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
          w-full pl-10 pr-4 py-2.5
          rounded-lg
          border border-gray-300
          bg-white
          text-sm text-gray-800
          focus:outline-none
          focus:ring-2 focus:ring-blue-500/20
          focus:border-blue-500
        "
            />
          </div>

          {/* DATE */}
          <input
            type="text"
            placeholder="d/m/y → d/m/y"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="
        px-4 py-2.5
        rounded-lg
        border border-gray-300
        bg-white
        text-sm text-gray-800
        focus:outline-none
        focus:ring-2 focus:ring-blue-500/20
        focus:border-blue-500
        max-w-[200px]
      "
          />

          {/* APPLY */}
          <button
            onClick={handleApplyFilter}
            className="
        px-6 py-2.5
        rounded-lg
        text-sm font-medium
        bg-blue-600 text-white
        hover:bg-blue-700
        shadow-[0_10px_30px_rgba(37,99,235,0.35)]
        transition
      "
          >
            Apply
          </button>
        </div>
      </div>

      {/* Campaign Table Container (Unchanged) */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="flex flex-col  bg-white overflow-hidden">
          {/* ===== FIXED HEADER ===== */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <TableColGroup />

              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Sn",
                    "Campaign Name",
                    "Source",
                    "Status",
                    "Integration",
                    "Clicks",
                    "Safe",
                    "Money",
                    "Created on",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-600 uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          {/* ===== SCROLLABLE BODY ===== */}
          <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar max-h-[320px]">
            <table className="min-w-full table-fixed divide-y divide-gray-100 bg-white">
              <TableColGroup />
              {renderTableContent()}
            </table>
          </div>

          {/* ===== FIXED FOOTER ===== */}
          <div className="flex-none bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
            {/* LEFT */}
            <span className="text-sm text-gray-600">
              Page
              <span className="text-gray-900 font-semibold">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="text-gray-900 font-semibold">{totalPages}</span>{" "}
              Pages
            </span>

            {/* RIGHT – Numbered Pagination */}
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-3 py-1.5 text-sm rounded-md border transition ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200 bg-white cursor-not-allowed"
                    : "text-gray-700 border-gray-300 bg-white hover:bg-gray-100"
                }`}
              >
                <span className="text-xl font-bold leading-none">&laquo;</span>
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-3 py-1.5 text-sm rounded-md border transition ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-200 bg-white cursor-not-allowed"
                    : "text-gray-700 border-gray-300 bg-white hover:bg-gray-100"
                }`}
              >
                <span className="text-xl font-bold leading-none">&raquo;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllCampaignsDashboard;
