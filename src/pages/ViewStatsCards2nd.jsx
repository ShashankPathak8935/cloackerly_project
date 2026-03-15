import { Link, Monitor, Smartphone, Tablet, Apple, Chrome } from "lucide-react";

export default function ViewStatsCards2nd({clickDetailsData}) {
  // ---------------- DATA ----------------

  const referrers = [
    { url: "https://testwala.org/", count: 5 },
    { url: "http://testurl.org/2025/11", count: 2 },
    { url: "http://testcheck.org/category/foodies", count: 2 },
    { url: "https://playtoys.org/wp-admin/post.php?id=1", count: 1 },
    { url: "https://google.com", count: 1 },
    { url: "https://facebook.com", count: 1 },
  ];

  const highRiskClicks = [
    {
      ip: "178.17.58.159",
      countryFlag: "🇩🇪",
      os: "Windows",
      device: "desktop",
      browser: "Chrome",
    },
    {
      ip: "178.17.58.159",
      countryFlag: "🇩🇪",
      os: "Mac",
      device: "desktop",
      browser: "Chrome",
    },
    {
      ip: "185.220.101.58",
      countryFlag: "🇩🇪",
      os: "Windows",
      device: "mobile",
      browser: "Chrome",
    },
  ];

  const duplicates = [];

  // ✅ NEW ISP DATA
  const ispData = [
    { name: "OVH SAS", count: 57 },
    { name: "Facebook, Inc.", count: 46 },
    { name: "Microsoft Corporation", count: 24 },
    { name: "Hetzner Online GmbH", count: 21 },
    { name: "Unknown ISP", count: 8 },
    { name: "Apple Inc.", count: 5 },
    { name: "Amazon AWS", count: 4 },
    { name: "Google LLC", count: 3 },
  ];

  // -------- ICON HELPERS --------

  const getOSIcon = (os) => {
    if (os === "Mac") return <Apple size={16} />;
    return <Monitor size={16} />;
  };

  const getDeviceIcon = (device) => {
    if (device === "mobile") return <Smartphone size={16} />;
    if (device === "tablet") return <Tablet size={16} />;
    return <Monitor size={16} />;
  };

  const getBrowserIcon = () => <Chrome size={16} />;

  const cardStyle =
  "bg-white rounded-2xl p-4 shadow-sm border border-gray-200";

  return (
    <div className="space-y-6">
      {/* ================= TOP 3 CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Referrers */}
        <div className={cardStyle}>
          <h3 className="text-gray-800 font-semibold mb-3">Top Referrers</h3>

          <div className="h-[220px] overflow-y-auto space-y-2 pr-2">
            {clickDetailsData?.data?.data?.topReferrers?.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm text-blue-600 truncate">
                  <Link size={14} />
                  <a href={item.url} target="_blank">
                    {item.url || "url not found"}
                  </a>
                </div>

                <span className="text-green-700 font-semibold text-sm">
                  {item.url_count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Clicks */}
        <div className={cardStyle}>
          <h3 className="text-gray-800 font-semibold mb-3">
            High Risk Clicks
          </h3>

          <div className="h-[220px] overflow-y-auto space-y-3 pr-2">
            {highRiskClicks.map((item, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl p-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">IP:</span> {item.ip}
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-gray-700">
                    <span>{item.countryFlag}</span>
                    {getOSIcon(item.os)}
                    {getBrowserIcon()}
                    {getDeviceIcon(item.device)}
                  </div>
                </div>

                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg">
                  High Risk
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Duplicates */}
 <div className={cardStyle}>
  <h3 className="text-gray-800 font-semibold mb-4">
    Recent Duplicates
  </h3>

  <div className="h-[220px] overflow-y-auto pr-1">
    {duplicates.length === 0 ? (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm italic">
          No duplicate clicks found
        </p>
      </div>
    ) : (
      <div className="space-y-2">
        {duplicates.map((d, i) => (
          <div
            key={i}
            className="
              flex justify-between items-center
              bg-gray-50 hover:bg-gray-100
              px-3 py-2
              rounded-lg
              transition-all
            "
          >
            <span className="text-sm text-gray-700 truncate">
              {d.ip || d}
            </span>

            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md">
              Duplicate
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
      </div>

      {/* ================= CLICKS BY ISP (LEFT BELOW) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className={cardStyle}>
    <h3 className="text-gray-800 font-semibold mb-4">
      Clicks by ISP
    </h3>

    <div className="h-[220px] overflow-y-auto space-y-2 pr-1">
      {clickDetailsData?.data?.topIsp?.map((item, index) => (
        <div
          key={index}
          className="
            flex justify-between items-center
            bg-gray-50
            hover:bg-gray-100
            px-3 py-2
            rounded-lg
            transition-all
          "
        >
          <span className="text-sm text-gray-700 truncate">
            {item?.isp || "N/A"}
          </span>

          <span className="text-sm font-semibold text-emerald-600">
            {item?.isp_click_count || ""}
          </span>
        </div>
      ))}
    </div>
  </div>
      </div>
    </div>
  );
}
