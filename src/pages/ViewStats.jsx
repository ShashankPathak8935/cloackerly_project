import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { getClickLogs,getAllCampNames,getClickIp } from "../api/Apis";
import { apiFunction } from "../api/ApiFunction";
// import { DateRangePicker } from "react-date-range"; // optional if using date picker
import ViewStatsCards from "../pages/ViewStatsCards";
import ViewStatsCards2nd from "./ViewStatsCards2nd";

const COLORS = ["#f56565", "#38a169"]; // red and green
const samplePieData = [
  { name: "High Risk", value: 5 },
  { name: "Safe", value: 81 },
];

const sampleBarData = [
  { country: "United States", clicks: 87 },
  { country: "Canada", clicks: 42 },
  { country: "Germany", clicks: 25 },
  { country: "France", clicks: 15 },
  { country: "Singapore", clicks: 5 },
  { country: "India", clicks: 2 },
  { country: "Guatemala", clicks: 1 },
  { country: "Brazil", clicks: 1 },
];

const ViewStats = () => {
  const [campId, setCampId] = useState("");
  const [showDropdown,setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [campaignList, setCampaignList] = useState([]);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [viewstatsData, setViewStatsData] = useState(null);
  const [clickDetailsData, setClickDetailsData] = useState(null);
  


  // fetch campaigns
    React.useEffect(() => {
      const fetchCampaigns = async () => {
        try {
          const res = await apiFunction("get", getAllCampNames, null, null);
          setCampaignList(res?.data?.data || []); // store campaigns
        } catch (err) {
          console.error("Error fetching campaigns:", err);
        }
      };
  
      fetchCampaigns();
    }, []);

    
  React.useEffect(() => {
  const handleClickOutside = () => setShowDropdown(false);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

// fetch data 
const fetchData = async () => {
  console.log("startdate", startdate)
    // const [start, end] = dateRange;

    // if (!start || !end) {
    //   showErrorToast("Please select a date range first.");
    //   return;
    // }

    // // Validate campaign dropdown
    // if (!campId) {
    //   showErrorToast("Please select a campaign.");
    //   return;
    // }

    // const startDate = start.toISOString().split("T")[0];
    // const endDate = end.toISOString().split("T")[0];

    // setLoading(true);

    try {
      const payload = {
        startdate,
        enddate
      };
      console.log("payload", payload)
      const [statsRes, detailsRes] = await Promise.all([
      apiFunction(
        "get",
        `${getClickLogs}?startdate=${startdate}&enddate=${enddate}&campId=${campId}`,
        null,
        null
      ),

      apiFunction(
        "get",
        `${getClickIp}?startdate=${startdate}&enddate=${enddate}&campId=${campId}`,
        null,
        null
      )
    ]);

     setViewStatsData(statsRes?.data?.data || "");

    // second API data
    setClickDetailsData(detailsRes?.data?.data || "");

      //   https://app.clockerly.io/api/v2/campaign/clicksbycamp?startdate=2025-11-01&enddate=2025-11-21&campId=14
      // const res = await apiFunction(
      //   "get",
      //   `${getClickLogs}?startdate=${startdate}&enddate=${enddate}&campId=${campId}`,
      //   null,
      //   null,
      // );

      // setViewStatsData(res || "");
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      // setLoading(false);
    }
  };

  console.log("setViewStatsData", viewstatsData);
  console.log("setClickDetailsData", clickDetailsData);


  

  return (
    <div className="p-4 font-sans min-h-screen bg-gray-50 mt-5">
      {/* Heading & Subheading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Insightful Traffic Overview
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Monitor clicks, unique visits, high-risk activity, and source
          analytics in real time.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        {/* Campaign */}
        <div className="flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
        >
     <label className="text-sm font-medium mb-1 text-gray-700">
    Campaign *
    </label>

  {/* INPUT (Search + Selected Value) */}
  <input
    type="text"
    placeholder="Search campaign..."
    value={searchText}
    onChange={(e) => {
      setSearchText(e.target.value);
      setShowDropdown(true);
    }}
    onFocus={() => setShowDropdown(true)}
    className="border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
  />

  {/* DROPDOWN */}
  {showDropdown && (
    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
      
      {campaignList
        .filter((camp) =>
          camp?.campaign_info?.campaignName
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
        )
        .map((camp) => (
          <div
            key={camp.uid}
            onClick={() => {
              setCampId(camp.uid);
              setSearchText(camp.campaign_info.campaignName);
              setShowDropdown(false);
            }}
            className="px-3 py-2 text-sm hover:bg-green-50 text-left text-gray-800 cursor-pointer"
          >
            {camp?.campaign_info?.campaignName}
          </div>
        ))}

      {campaignList.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-800">
          No campaign found
        </div>
      )}
    </div>
  )}
</div>

        {/* Date Range */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-700">
            Date Range *
          </label>

          <div className="flex items-center gap-2">
            {/* From Date */}
            <input
              type="date"
              name="startdate"
              value={startdate}
              onChange={(e) => setStartdate(e.target.value)}
              className="border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
            />

            <span className="text-gray-500 text-sm">to</span>

            {/* To Date */}
            <input
              type="date"
              name="enddate"
              value={enddate}
              onChange={(e) => setEnddate(e.target.value)}
              className="border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Apply Button */}
        <button className="bg-green-600 text-white px-4 py-2 cursor-pointer rounded-md hover:bg-green-700 transition"
        onClick={fetchData}
        >
          Apply
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-md shadow text-center">
          <div className="text-green-600 text-2xl font-bold">{viewstatsData?.stats?.total_clicks || 0}</div>
          <div className="text-gray-500 text-sm">Total Clicks</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow text-center">
          <div className="text-gray-800 text-2xl font-bold">{viewstatsData?.stats?.vpn_clicks || 10}</div>
          <div className="text-gray-500 text-sm">VPN Clicks</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow text-center">
          <div className="text-green-600 text-2xl font-bold">{viewstatsData?.stats?.unique_clicks || 0}</div>
          <div className="text-gray-500 text-sm">Unique Clicks</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow text-center">
          <div className="text-red-600 text-2xl font-bold">{viewstatsData?.stats?.high_risk_clicks || 0}</div>
          <div className="text-gray-500 text-sm">High Risk Clicks</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-sm font-medium mb-4">Click Risk Distribution</h2>

          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={samplePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={80}
              >
                {samplePieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  color: "#111827",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  opacity: 1,
                }}
                itemStyle={{
                  color: "#111827",
                  fontWeight: 500,
                }}
                labelStyle={{
                  color: "#6b7280",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {samplePieData.map((item, index) => {
              const total = samplePieData.reduce(
                (sum, entry) => sum + entry.value,
                0,
              );

              const percentage = ((item.value / total) * 100).toFixed(0);

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md shadow-sm"
                >
                  {/* Color Dot */}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></span>

                  {/* Name */}
                  <span className="text-sm text-gray-700 font-medium">
                    {item.name}
                  </span>

                  {/* Value + Percentage */}
                  <span className="text-sm text-gray-500">
                    ({item.value} • {percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-sm font-medium mb-4">Clicks by Country</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3">
        <ViewStatsCards clickDetailsData={clickDetailsData}/>
      </div>
      <div className="mt-3">
        <ViewStatsCards2nd clickDetailsData={clickDetailsData}/>
      </div>
    </div>
  );
};

export default ViewStats;
