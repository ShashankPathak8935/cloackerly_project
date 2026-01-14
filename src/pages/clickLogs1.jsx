import { useEffect, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { clicksbycampaign, getAllCampNames } from "../api/Apis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DEVICE_LIST } from "../data/dataList";
import { showErrorToast } from "../components/toast/toast";

const dropdownStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "1em 1em",
};

const getDeviceIcon = (deviceName) => {
  const match = DEVICE_LIST.find((d) => d.device === deviceName);
  return match?.icon || null;
};

const DateRangePicker = ({ dateRange, setDateRange, customRequired }) => {
  const [startDate, endDate] = dateRange;

  return (
    <div className="flex-grow max-w-xs min-w-s">
      <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
        DATE RANGE {customRequired && <span className="text-red-500">*</span>}
      </label>

      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          const normalize = (d) =>
            d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12) : null;

          setDateRange([normalize(update?.[0]), normalize(update?.[1])]);
        }}
        isClearable
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/MM/yyyy to dd/MM/yyyy"
        className="w-full p-2 bg-white text-gray-800 border border-gray-600 rounded cursor-pointer"
      />
    </div>
  );
};

const CampaignDropdown = ({ campId, setCampId, campaigns }) => {
  return (
    <div className="flex-grow max-w-xs">
      <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
        CAMPAIGN <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <select
          id="campaign"
          value={campId || ""} // controlled component
          onChange={(e) => setCampId(e.target.value)} // update parent
          className="w-full text-sm py-2 px-3 border border-gray-600 rounded-md shadow-sm bg-white text-gray-800 appearance-none pr-8 cursor-pointer"
          style={dropdownStyle}
        >
          <option value="">--Select--</option>
          {campaigns.map((camp) => (
            <option key={camp.uid} value={camp.uid}>
              {camp?.campaign_info?.campaignName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const Clicklogs = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [campaigns, setCampaigns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campId, setCampId] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await apiFunction("get", getAllCampNames, null, null);
        setCampaigns(res?.data?.data || []); // store campaigns
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);

  //   FETCHING TABLE CONTENT
  const fetchData = async () => {
    const [start, end] = dateRange;

    if (!start || !end) {
      showErrorToast("Please select a date range first.");
      return;
    }

    // Validate campaign dropdown
    if (!campId) {
      showErrorToast("Please select a campaign.");
      return;
    }

    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    setLoading(true);

    try {
      const payload = {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      };

      //   https://app.clockerly.io/api/v2/campaign/clicksbycamp?startdate=2025-11-01&enddate=2025-11-21&campId=14
      const res = await apiFunction(
        "get",
        `${clicksbycampaign}?startdate=${startDate}&enddate=${endDate}&campId=${campId}`,
        null,
        null
      );

      setTableData(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setIsResetting(true);

    // thoda sa delay taaki animation dikhe
    setTimeout(() => {
      setDateRange([null, null]);
      setCampId(null);
      setTableData([]);
      setIsResetting(false);
    }, 600); // 600ms smooth lagta hai
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between pt-6 mb-6 px-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Click Logs</h1>
            <p className="text-sm text-gray-500 mt-1">
              Campaign click logs and details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className={`
          px-3 py-2 text-sm flex items-center gap-2
          rounded-lg border transition
          ${
            isResetting
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
        `}
            >
              {isResetting && (
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              )}
              Reset
            </button>

            <button
              disabled={!tableData || tableData.length === 0}
              className={`
          px-4 py-2 text-sm font-medium rounded-lg shadow-sm
          ${
            tableData?.length
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
            >
              Download Excel
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="mx-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-end gap-4 p-5">
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
              customRequired={false}
            />

            <CampaignDropdown
              campId={campId}
              setCampId={setCampId}
              campaigns={campaigns}
            />

            <button
              onClick={fetchData}
              className="h-[40px] px-5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
              <table className="min-w-full table-fixed">
                <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center w-16">
                      S No.
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center w-40">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                      Result
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center w-40">
                      Log
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center w-32">
                      City
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                      IP
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                      IP Score
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                      Proxy
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                      ISP
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                      ASN
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-left min-w-48">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-left min-w-48">
                      User Agent
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="12"
                        className="py-10 text-center text-gray-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : tableData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="12"
                        className="py-10 text-center text-gray-400"
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    tableData.map((item, index) => (
                      <tr
                        key={item.tid}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700 min-w-40">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "Unknown"}
                        </td>

                        <td className="px-6 py-4 text-sm text-center">
                          <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            {item.status ? "Money Page" : "Save Page"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* existing icon logic untouched */}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.city || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.ip || "Unknown"}
                        </td>

                        <td className="px-6 py-4 text-sm text-center text-gray-700">
                          {item.risk ?? "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.proxy || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.isp || "Unknown"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.asn || "Unknown"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700 min-w-48">
                          {item.referrer || "No Referrer"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700 min-w-48">
                          {item.user_agent || "No User Agent"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200 bg-gray-50">
              <button className="h-8 w-8 rounded-md text-gray-400 hover:bg-white hover:text-gray-700">
                &lt;
              </button>
              <button className="h-8 w-8 rounded-full bg-blue-600 text-white text-sm">
                1
              </button>
              <button className="h-8 w-8 rounded-md text-gray-400 hover:bg-white hover:text-gray-700">
                2
              </button>
              <button className="h-8 w-8 rounded-md text-gray-400 hover:bg-white hover:text-gray-700">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clicklogs;
