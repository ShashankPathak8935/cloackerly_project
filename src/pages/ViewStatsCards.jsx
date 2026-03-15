import {
  Monitor,
  Smartphone,
  Bot,
  Apple,
  HelpCircle,
  Laptop,
} from "lucide-react";

export default function ViewStatsCards({clickDetailsData}) {
  // -------- SAMPLE DATA --------

const osIcons = {
  "Windows": <Laptop size={16} />,
  "OS X": <Apple size={16} />,
  "Mac OS": <Apple size={16} />,
  "iOS": <Smartphone size={16} />,
  "Android": <Smartphone size={16} />,
  "Unknown": <HelpCircle size={16} />,
};

const deviceIcon = {
  "robot": <Bot size={16} />,
  "desktop": <Monitor size={16} />,
  "phone":<Smartphone size={16} />
}

  // const devices = [
  //   { name: "robot", count: 166, icon: <Bot size={16} /> },
  //   { name: "desktop", count: 15, icon: <Monitor size={16} /> },
  //   { name: "phone", count: 5, icon: <Smartphone size={16} /> },
  // ];

  // -------- COMMON CARD STYLE --------
  const cardStyle =
  "bg-white rounded-2xl p-4 shadow-sm border border-gray-200";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* ================= TOP IPS ================= */}
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
    <h3 className="text-gray-800 font-semibold mb-4">Top IPs</h3>

    <div className="h-[220px] overflow-y-auto pr-2 space-y-2">
      {clickDetailsData?.data?.ipClicks?.map((item, i) => (
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
            {item?.ip}
          </span>

          <span className="text-green-600 font-semibold text-sm">
            {item?.ip_click_count}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* ================= TOP OS ================= */}
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
    <h3 className="text-gray-800 font-semibold mb-4">Top OS</h3>

    <div className="space-y-2">
      {clickDetailsData?.data?.clickOs?.map((item, i) => (
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
              {osIcons[item?.os] || <HelpCircle size={16} />}
            </span>
            <span className="font-medium">
              {item?.os}
            </span>
          </div>

          <span className="text-green-600 font-semibold text-sm">
            {item?.os_click_count}
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
      {clickDetailsData?.data?.deviceClicks?.map((item, i) => (
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
              {deviceIcon[item?.os] || <HelpCircle size={16} />}
            </span>

            <span className="font-medium">
              {item.device || "N/A"}
            </span>
          </div>

          {/* COUNT */}
          <span className="text-green-600 font-semibold text-sm">
            {item.device_click_count || 0}
          </span>
        </div>
      ))}
    </div>
  </div>

</div>
  );
}
