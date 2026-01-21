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
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { useNavigate, Link } from "react-router-dom";
// import {ipClicks} from "../api/Apis.js";
import { apiFunction } from "../api/ApiFunction.js";
import {
  ipClicks,
  campdata,
  getAllCampaign,
  signOutApi,
  createCampaignApi,
} from "../api/Apis.js";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../components/toast/toast.jsx";

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    blocked_campaigns: 0,
    allowed_campaigns: 0,
  });

  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const ITEMS_PER_PAGE = 5;

  const [clickSummary, setClickSummary] = useState({
    totalClicks: 0,
    safeClicks: 0,
    moneyClicks: 0,
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);

      await Promise.all([fetchIpClicks(), fetchStats(), fetchCampaigns()]);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600); // smooth UX
    }
  };

  // const goToCampaign = (id) => alert("Open campaign: " + id);
  // const prevPage = () => setPage((p) => Math.max(1, p - 1));
  // const nextPage = () => setPage((p) => p + 1);

  const fetchIpClicks = async () => {
    try {
      setLoading(true);

      const res = await apiFunction("get", ipClicks);
      const rawData = res?.data?.data || [];

      // 👉 Only latest 10 days
      const last10DaysData = rawData.slice(-10);

      // Chart data
      const formattedData = last10DaysData.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        Safe: Number(item.total_s_clicks || 0),
        Money: Number(item.total_m_clicks || 0),
        Total: Number(item.total_t_clicks || 0),
      }));

      setChartData(formattedData);

      // Summary totals (only last 10 days)
      const totals = last10DaysData.reduce(
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
      console.log(response);

      // Assume total items is available in response.data.total or we use array length
      const dataRows = response.data.data || [];

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

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask("");
  };

  // ✅ Toggle complete/incomplete
  // const handleToggleComplete = (id) => {
  //   setTasks((prev) =>
  //     prev.map((task) =>
  //       task.id === id ? { ...task, completed: !task.completed } : task
  //     )
  //   );
  // };

  // ✅ Delete task
  // const handleDeleteTask = (id) => {
  //   setTasks((prev) => prev.filter((task) => task.id !== id));
  // };

  // ✅ Filtered tasks by search
  // const filteredTasks = tasks.filter((task) =>
  //   task.text.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleActionClick = (e, campaignId) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setDropdownPos({
      top: rect.bottom + 2, // below button
      left: rect.right - 150, // align right (w-48 = 192px)
    });
    setOpenDropdownId(openDropdownId === campaignId ? null : campaignId);
  };

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
             await fetchCampaigns();
             await fetchStats();
           }
         }
         break;
       default:
         break;
     }
   };

  const handleAddNewCampaign = () => {
    showInfoToast("Redirecting to Creating New Campaign");
    navigate("/Dashboard/create-campaign");
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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchCampaigns(page);
  };

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      signOut();
      navigate("/signin");
    }

    fetchIpClicks();
    fetchStats();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Load Todos from LocalStorage on page load
  useEffect(() => {
    const savedTasks = localStorage.getItem("todo_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // ✅ Auto Save Todos to LocalStorage
  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Small reusable StatCard
  const StatCard = ({ icon, value, title, subtitle }) => (
    <div
      className="
      bg-white
      border border-slate-200
      px-5 py-6
      min-w-[260px]
      shadow-sm
      hover:shadow-md
      transition-all duration-300
    "
    >
      {/* Title */}
      <div className="text-lg font-semibold text-slate-500 mb-4 tracking-tight">
        {title}
      </div>

      {/* Icon */}
      <div className="mb-3 flex justify-center">
        <div
          className="
          w-12 h-12
          rounded-lg
          bg-blue-50
          text-blue-600
          flex items-center justify-center
          text-xl
        "
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="text-4xl font-medium text-slate-900 mb-3">{value}</div>

      {/* Footer link / subtitle */}
      {subtitle && <div className="text-sm text-slate-500">{subtitle}</div>}
    </div>
  );

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
    <div className="min-h-screen bg-white p-6 text-gray-800">
      {/* Header */}
      <div className="flex items-center mt-3 justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          {/* <p className="text-gray-400 text-sm">Let's do something new.</p> */}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddNewCampaign}
            className="flex items-center px-4 py-2 text-white bg-blue-400 hover:bg-blue-700 rounded-xl font-medium text-sm shadow-lg transition duration-150 cursor-pointer"
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
            New Campaign
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 cursor-pointer
    ${
      isRefreshing
        ? "bg-green-200 cursor-not-allowed opacity-80"
        : "bg-green-400 hover:bg-gray-600 cursor-pointer"
    }
  `}
          >
            <svg
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
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

            <span className="whitespace-nowrap">
              {isRefreshing ? "Reloading data..." : "Reload"}
            </span>
          </button>
        </div>
      </div>

      {/* Top Stats */}
      {/* <div className="mb-6 flex gap-0 flex-wrap">
        <StatCard
          icon={<BarChart3 size={22} />}
          value={stats.total_campaigns}
          title="Total Campaigns"
          subtitle="See in-depth performance"
        />
        <StatCard
          icon={<PlayCircle size={22} />}
          value={stats.active_campaigns}
          title="Active Campaigns"
          subtitle="Currently running"
        />
        <StatCard
          icon={<ShieldCheck size={22} />}
          value={stats.allowed_campaigns}
          title="Allowed Traffic"
          subtitle="View allow rules"
        />
        <StatCard
          icon={<ShieldX size={22} />}
          value={stats.blocked_campaigns}
          title="Blocked Traffic"
          subtitle="Security insights"
        />
      </div> */}
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

      <div className="bg-gray-100/40 p-6">
        {/* <h3 className="text-blue text-lg font-semibold mb-2">
          Clicks Data Overview
        </h3> */}
        <div className="flex items-start justify-between mb-4">
          {/* Heading */}
          <h3 className="text-blue text-lg font-semibold pt-1">
            Clicks Data Overview
          </h3>

          {/* Text-based selectable boxes */}
          <div className="flex gap-3 mr-10">
            {/* ACTIVE */}
            <div className="cursor-pointer border-b-2 border-blue-600 pb-1">
              <p className="text-sm font-semibold text-blue-600">
                Last 30 Days
              </p>
              <p className="text-xs text-slate-500">Safe: 12K</p>
              <p className="text-xs text-slate-500">Money: 8K</p>
              <p className="text-xs font-medium text-slate-700">Total: 20K</p>
            </div>

            {/* INACTIVE */}
            <div className="cursor-pointer pb-1 hover:text-blue-600">
              <p className="text-sm font-medium text-slate-600">Last 15 Days</p>
              <p className="text-xs text-slate-400">Safe: 7K</p>
              <p className="text-xs text-slate-400">Money: 4K</p>
              <p className="text-xs text-slate-500">Total: 11K</p>
            </div>

            <div className="cursor-pointer pb-1 hover:text-blue-600">
              <p className="text-sm font-medium text-slate-600">Last 10 Days</p>
              <p className="text-xs text-slate-400">Safe: 4K</p>
              <p className="text-xs text-slate-400">Money: 3K</p>
              <p className="text-xs text-slate-500">Total: 7K</p>
            </div>

            <div className="cursor-pointer pb-1 hover:text-blue-600">
              <p className="text-sm font-medium text-slate-600">Last 1 Day</p>
              <p className="text-xs text-slate-400">Safe: 600</p>
              <p className="text-xs text-slate-400">Money: 300</p>
              <p className="text-xs text-slate-500">Total: 900</p>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", height: 260 }}>
          {loading ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>
          ) : chartData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-2">📉</div>
              <p className="text-slate-400 text-sm font-medium">
                No IP Click Data Available
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Data will appear here once clicks are recorded.
              </p>
            </div>
          ) : (
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="actualGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#e5e7eb"
                  vertical={false}
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#111827",
                  }}
                  cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                />

                {/* Actual Value */}
                <Line
                  type="monotone"
                  dataKey="Safe"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Actual Value"
                />

                <Area
                  type="monotone"
                  dataKey="Safe"
                  fill="url(#actualGradient)"
                  stroke="none"
                />

                {/* Projected Value */}
                <Line
                  type="monotone"
                  dataKey="Money"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                  name="Money page Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

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

      {/* Bottom Cards */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        
        <div className="bg-gray-850/40 border border-gray-700 rounded-lg p-6 min-h-[220px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">To do</h4>
            <div className="text-slate-400 text-sm">Reminders List for me</div>
          </div>

          <div className="bg-slate-900 border border-gray-800 rounded-md p-4 min-h-[120px]">
          
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-gray-700 px-3 py-2 rounded-md text-slate-300 mb-3"
              placeholder="Search tasks"
            />

          
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 w-full bg-transparent border border-gray-700 px-3 py-2 rounded-md text-slate-300"
                placeholder="Write new task..."
              />
              <button
                onClick={handleAddTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>

        
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {filteredTasks.length === 0 ? (
                <p className="text-slate-400 text-sm text-center">
                  No tasks found
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-md"
                  >
                    <div
                      onClick={() => handleToggleComplete(task.id)}
                      className={`cursor-pointer text-sm ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-white"
                      }`}
                    >
                      {task.text}
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      ❌
                    </button>
                  </div>
                ))
              )}
            </div>

          
            <div className="mt-3 text-slate-400 text-xs text-right">
              {tasks.length} tasks
            </div>
          </div>
        </div>

      
        <div className="bg-gray-850/40 border border-gray-700 rounded-lg p-6 min-h-[220px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">
              Click Metrics - Realtime Logs
            </h4>
            <div className="text-slate-400 text-sm">
              Recent activity in 10 days
            </div>
          </div>

          <div className="bg-slate-900 border border-gray-800 rounded-md p-6">
            {loading ? (
              <p className="text-center text-slate-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
            
                <div className="text-center">
                  <div className="bg-slate-800 p-4 rounded-md inline-block">
                    <div className="text-2xl font-semibold text-white">
                      {clickSummary.totalClicks}
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs mt-2">
                    Total Clicks
                  </div>
                </div>

                
                <div className="text-center">
                  <div className="bg-slate-800 p-4 rounded-md inline-block">
                    <div className="text-2xl font-semibold text-white">
                      {clickSummary.safeClicks}
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs mt-2">Safe Clicks</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
