import {
  Monitor,
  Smartphone,
  Bot,
  Apple,
  HelpCircle,
  Laptop,
} from "lucide-react";

export default function ViewStatsCards() {
  // -------- SAMPLE DATA --------
  const topIPs = [
    { ip: "5.9.120.8", count: 21 },
    { ip: "2a03:2880:f80e:48::", count: 2 },
    { ip: "47.82.11.36", count: 2 },
    { ip: "176.31.139.10", count: 2 },
    { ip: "2a03:2880:f800:d::", count: 2 },
    { ip: "178.17.58.159", count: 2 },
    { ip: "192.168.1.1", count: 1 },
    { ip: "10.0.0.2", count: 1 },
  ];

  const topOS = [
    { name: "Unknown", count: 164, icon: <HelpCircle size={16} /> },
    { name: "OS X", count: 11, icon: <Apple size={16} /> },
    { name: "Windows", count: 6, icon: <Laptop size={16} /> },
    { name: "iOS", count: 5, icon: <Smartphone size={16} /> },
  ];

  const devices = [
    { name: "robot", count: 166, icon: <Bot size={16} /> },
    { name: "desktop", count: 15, icon: <Monitor size={16} /> },
    { name: "phone", count: 5, icon: <Smartphone size={16} /> },
  ];

  // -------- COMMON CARD STYLE --------
  const cardStyle =
  "bg-white rounded-2xl p-4 shadow-sm border border-gray-200";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* ================= TOP IPS ================= */}
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
    <h3 className="text-gray-800 font-semibold mb-4">Top IPs</h3>

    {/* Fixed height + Scroll */}
    <div className="h-[220px] overflow-y-auto pr-2 space-y-2">
      {topIPs.map((item, i) => (
        <div
          key={i}
          className="
            flex justify-between items-center
            bg-gray-50 hover:bg-gray-100
            px-3 py-2.5
            rounded-xl
            transition-all
          "
        >
          <span className="text-sm text-gray-800 truncate">
            {item.ip}
          </span>

          <span className="text-green-600 font-semibold text-sm">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* ================= TOP OS ================= */}
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
    <h3 className="text-gray-800 font-semibold mb-4">Top OS</h3>

    <div className="space-y-2">
      {topOS.map((item, i) => (
        <div
          key={i}
          className="
            flex justify-between items-center
            bg-gray-50 hover:bg-gray-100
            px-3 py-2.5
            rounded-xl
            transition-all
          "
        >
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-gray-600">
              {item.icon}
            </span>
            <span className="font-medium">
              {item.name}
            </span>
          </div>

          <span className="text-green-600 font-semibold text-sm">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* ================= DEVICE DISTRIBUTION ================= */}
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
    <h3 className="text-gray-800 font-semibold mb-4">
      Device Distribution
    </h3>

    <div className="space-y-2">
      {devices.map((item, i) => (
        <div
          key={i}
          className="
            flex justify-between items-center
            bg-gray-50 hover:bg-gray-100
            px-3 py-2.5
            rounded-xl
            transition-all
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-gray-600">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>
          </div>

          {/* COUNT */}
          <span className="text-green-600 font-semibold text-sm">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  </div>

</div>
  );
}
