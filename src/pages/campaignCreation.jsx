import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFunction } from "../api/ApiFunction";
import { createCampaignApi } from "../api/Apis";
import { BROWSER_LIST, COUNTRY_LIST, DEVICE_LIST } from "../data/dataList";
import { showSuccessToast } from "../components/toast/toast";

/* ===========================
   Icon components (inline SVG)
   (kept from original parts)
   =========================== */

// const GitMerge = ({ className }) => (
//   <svg
//     className={className}
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <circle cx="18" cy="18" r="3" />
//     <circle cx="6" cy="6" r="3" />
//     <path d="M6 21V9a9 9 0 0 1 9 9" />
//   </svg>
// );
// const Filter = ({ className }) => (
//   <svg
//     className={className}
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
//   </svg>
// );
// const Bot = ({ className }) => (
//   <svg
//     className={className}
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M12 8V4H8" />
//     <rect width="16" height="12" x="4" y="8" rx="2" />
//     <path d="M2 14h2" />
//     <path d="M20 14h2" />
//     <path d="M15 13v2" />
//     <path d="M9 13v2" />
//   </svg>
// );
const Info = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
const Play = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const Zap = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const CircleSlash = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="9" x2="15" y1="15" y2="9" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const CalendarDays = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);
const ChevronDown = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const MessageCircle = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const Plus = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const LayoutIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 10h18M9 20V10" />
  </svg>
);

const CardIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const ShieldLockIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
  </svg>
);

const BranchIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="M6 9v5a5 5 0 0 0 5 5h4" />
  </svg>
);

const SlidersIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
  </svg>
);

const SparkIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
  </svg>
);

/* ===========================
   Small reusable UI pieces
   (restyled to match Dark Steel theme)
   =========================== */

const CustomAlertModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl max-w-sm w-full border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">Information</h3>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/* InputField - styled */
const InputField = ({
  label,
  name,
  register,
  error,
  required,
  placeholder,
  type = "text",
  icon,
  defaultValue,
  tooltip,
  pattern,
  step,
}) => (
  <div>
    <label className="flex items-center text-xs font-semibold text-slate-400 tracking-wider mb-2">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
      {tooltip && (
        <Tooltip title={tooltip} placement="top">
          <span className="ml-2 cursor-pointer">
            <Info className="w-4 h-4 text-slate-500" />
          </span>
        </Tooltip>
      )}
    </label>

    <div className="relative">
      {icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        step={step}
        className={`w-full bg-white border text-sm rounded-lg py-2 text-gray-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          icon ? "pl-10" : "px-4"
        } ${error ? "border-red-500" : "border-slate-700"}`}
        {...register(name, {
          required: required ? `${label} is required.` : false,
          pattern: pattern || undefined,
          valueAsNumber: type === "number" ? true : undefined,
        })}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
  </div>
);

/* SelectField - styled */
const SelectField = ({
  label,
  name,
  register,
  error,
  required,
  tooltip,
  options = [],
}) => (
  <div>
    <label className="flex items-center text-xs font-semibold text-slate-400 tracking-wider mb-2">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
      {tooltip && (
        <Tooltip title={tooltip}>
          <span className="ml-2 cursor-pointer">
            <Info className="w-4 h-4 text-slate-500" />
          </span>
        </Tooltip>
      )}
    </label>
    <div className="relative">
      <select
        className={`w-full appearance-none bg-white border rounded-lg py-2 px-4 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? "border-red-500" : "border-slate-700"
        }`}
        {...register(name, { required: required && `${label} is required.` })}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
  </div>
);

/* StatusButton - styled card button */
const StatusButton = ({ label, Icon, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 h-20 w-full cursor-pointer ${
      isActive
        ? "border-blue-500 bg-blue-500/10"
        : "border-slate-700 bg-slate-800 hover:bg-slate-700/50"
    }`}
  >
    <Icon
      className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400"}`}
    />
    <span
      className={`text-sm font-medium mt-2 ${
        isActive ? "text-white" : "text-slate-300"
      }`}
    >
      {label}
    </span>
  </button>
);

/* Dashboard Layout wrapper */
const DashboardLayout = ({ children }) => (
  <div
    style={{ fontFamily: "Outfit, sans-serif" }}
    className="min-h-screen bg-[#f8fafc] text-slate-900"
  >
    <div className="max-w-7xl mx-auto px-10 py-8">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200">
        <div className="p-10">{children}</div>
      </div>
    </div>
  </div>
);

/* ===========================
   Main Combined Component
   =========================== */

export default function CampaignBuilder() {
  // Shared state across steps
  const [step, setStep] = useState(1);
  const [moneyPages, setMoneyPages] = useState([
    { description: "", url: "", weight: 100 },
  ]);
  const [dynamicVariables, setDynamicVariables] = useState([]);
  const [appendUrl, setAppendUrl] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showInputs, setShowInputs] = useState({
    activateAfterX: false,
    frequencyCap: false,
    zeroRedirect: false,
    pageGuard: false,
  });
  const [editCampaignId, setEditCampaignId] = useState(null);

  const [activeStatus, setActiveStatus] = useState("Active");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchCampaignById = async (id) => {
    try {
      const res = await apiFunction(
        "get",
        `${createCampaignApi}/${id}`,
        null,
        null
      );

      const c = res.data.data;

      reset({
        campaignName: c?.campaign_info?.campaignName,
        comment: c?.campaign_info?.comment,
        epc: c?.campaign_info?.epc,
        cpc: c?.campaign_info?.cpc,
        trafficSource: c?.campaign_info?.trafficSource,
        money_page: c?.money_page,
        safe_page: c?.safe_page,
        conditions: c?.conditions,
        filters: c?.filters,
        afterX: c?.afterX,
        automate: c?.automate,
        page_guard: c?.page_guard,
        http_code: c?.http_code,
      });

      setMoneyPages(
        c?.money_page || [{ description: "", url: "", weight: 100 }]
      );

      setDynamicVariables(c?.dynamicVariables || []);
      setActiveStatus(c?.status);
    } catch (err) {
      console.error("Failed to fetch campaign", err);
    }
  };

  useEffect(() => {
    if (location?.state?.mode === "edit" && location.state.id) {
      setEditCampaignId(location.state.id);
    }
  }, [location.state]);
  useEffect(() => {
    if (editCampaignId) {
      fetchCampaignById(editCampaignId);
    }
  }, [editCampaignId]);

  // options copied from parts
  const adPlatforms = [
    "Google Adwords",
    "Binge Ads",
    "Yahoo Gemini",
    "Taboola",
    "Facebook Adverts",
    "TikTok Ads",
    "50onRed",
    "ADAMO",
    "AdRoll",
    "AdSupply",
    "Adblade",
    "Adcash",
    "Admob",
    "Adnium",
    "Adsterra",
    "Advertise.com",
    "Airpush",
    "Amazon Ads",
    "Bidvertiser",
    "Blindclick",
    "CNET",
    "CPMOZ",
    "DNTX",
    "Dianomi",
    "DoublePimp",
    "Earnify",
    "EPOM Market",
    "Etrag.ru",
    "Exoclicks",
    "Flix Media",
    "Go2Mobi",
    "Gravity",
    "Gunggo Ads",
    "InMobi",
    "Instagram",
    "Juicy Ads",
    "Lead Impact",
    "LeadBolt",
    "LeadSense",
    "Ligatus",
    "Linkedin",
    "MGID",
    "MarketGid",
    "Media Traffic",
    "Millennial Media",
    "MoPub",
    "MobiAds",
    "NTENT",
    "Native Ads",
    "NewsCred",
    "Octobird",
    "OpenX",
    "Others",
    "Outbrain",
    "Pinterest Ads",
    "Plista",
    "Plugrush",
    "PocketMath",
    "PopAds",
    "PopCash",
    "PopMyAds",
    "Popwin",
    "Popunder.net",
    "PropelMedia",
    "Propeller Ads",
    "Qwaya Ads",
    "Rapsio",
    "RealGravity",
    "Redirect.com",
    "Recontent",
    "Revenue Hits",
    "Simple Reach",
    "Skyword",
    "SiteScout (Basis)",
    "StackAdapt",
    "StartApp",
    "SynupMedia",
    "TapSense",
    "Traffic Broker",
    "Target.my.com",
    "Traffic Factory",
    "Traffic Force",
    "Traffic Holder",
    "Traffic Junky",
    "Traffic Hunt",
    "Traflow",
    "Trellian",
    "Twitter",
    "Unity Ads",
    "Vk.com",
    "WebCollage",
    "Widget Media",
    "Yandex",
    "Zemanta",
    "ZeroPark",
    "MaxVisits",
    "Revisitors",
    "Snapchat Ads",
    "Organic Traffic",
    "Galaksion",
    "Traffic Stars",
    "Snackvideo",
  ];

  const fixedOptions = [
    { id: 1, label: "BUSINESS" },
    { id: 2, label: "GOVERNMENT" },
    { id: 3, label: "Wireless" },
    { id: 4, label: "ASN TS" },
    { id: 5, label: "BIPS" },
    { id: 6, label: "BOT" },
    { id: 7, label: "DATA CENTER" },
    { id: 8, label: "HRIP" },
    { id: 9, label: "ISP TS" },
    { id: 10, label: "LRIP" },
    { id: 11, label: "PROXY/VPN" },
    { id: 12, label: "TIME ZONE" },
    { id: 13, label: "TSIF" },
  ];

  const OPTIONS = [
    { value: "country", label: "Country" },
    { value: "state", label: "State" },
    { value: "zip", label: "Zip Code" },
    { value: "browser", label: "Browser" },
    { value: "Device", label: "Device" },
    { value: "ASN", label: "ASN" },
    { value: "referrer", label: "Referrer" },
    { value: "IP", label: "IP" },
    { value: "userAgent", label: "User Agent" },
    { value: "isp", label: "ISP" },
  ];

  const steps = [
    { id: 1, title: "Campaign Info", icon: LayoutIcon },
    { id: 2, title: "Money Info", icon: CardIcon },
    { id: 3, title: "Safe Page", icon: ShieldLockIcon },
    { id: 4, title: "Conditions", icon: BranchIcon },
    { id: 5, title: "Campaign Filters", icon: SlidersIcon },
    { id: 6, title: "Automate", icon: SparkIcon },
  ];

  const statusOptions = [
    { name: "Active", icon: Play },
    { name: "Allow", icon: Zap },
    { name: "Block", icon: CircleSlash },
    // { name: "Schedule", icon: CalendarDays },
  ];

  /* ---------------------------
     Form (react-hook-form)
     --------------------------- */
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    trigger,
    clearErrors,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      campaignName: null,
      comment: null,
      epc: null,
      cpc: null,
      trafficSource: adPlatforms[0],
      money_page: [{ description: "", url: "", weight: 100 }],
      safe_page: null,
      conditions: [],
      filters: [],
      afterX: null,
      automate: {
        frequencyCap: { value: "" },
        zeroRedirect: { curl: false, iframe: false },
        gclid: false,
        ipCap: false,
      },
      page_guard: { key: "", url: "", second: "" },
      http_code: "301",
    },
  });
  const afterXValue = watch("afterX");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });
  const selectedTypes = watch("conditions").map((c) => c.type);

  useEffect(() => {
    if (Number(afterXValue) > 0) {
      setShowInputs((p) => ({ ...p, afterX: true }));
    }
  }, [afterXValue]);

  /* ---------------------------
     helper handlers
     --------------------------- */
  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  const hideCustomAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const addMoneyPage = () => {
    setMoneyPages((p) => {
      const next = [...p, { description: "", url: "", weight: 100 }];

      return next;
    });
  };

  const removeMoneyPage = (index) => {
    setMoneyPages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setValue("money_page", next);
      return next;
    });
  };

  const addDynamicVariable = () => {
    setDynamicVariables((p) => [...p, { name: "", value: "" }]);
  };

  const removeDynamicVariable = (index) => {
    setDynamicVariables((p) => p.filter((_, i) => i !== index));
  };

  const handleAddCondition = (type) => {
    append({ type, mode: "allow", values: [] });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleNext = async () => {
    // validate relevant fields before next
    if (step === 1) {
      const fieldsToValidate = ["campaignName", "trafficSource"];
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }
    if (step === 2) {
      // validate money page urls
      const moneyFields = moneyPages.map((_, i) => `money_page.${i}.url`);
      const valid = await trigger(moneyFields);
      if (!valid) return;
    }
    if (step == 3) {
      const safePageField = "safe_page";
      const valid = await trigger(safePageField);
      if (!valid) return;
    }
    nextStep();
  };

  // handle step click

  const handleStepClick = async (targetStep) => {
    // 🔙 Backward movement → always allowed
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }

    // 👉 Forward movement → validate CURRENT step only
    if (step === 1) {
      const fieldsToValidate = ["campaignName", "trafficSource"];
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }

    if (step === 2) {
      const moneyFields = moneyPages.map((_, i) => `money_page.${i}.url`);
      const valid = await trigger(moneyFields);
      if (!valid) return;
    }

    if (step === 3) {
      const valid = await trigger("safe_page");
      if (!valid) return;
    }

    // ✅ validation passed → go to clicked step
    setStep(targetStep);
  };

  const onSubmit = async (data) => {
    try {
      // merge moneyPages from local state into data (to ensure latest)
      // data.money_page = moneyPages;
      data.status = activeStatus;

      if (location?.state?.mode === "edit") {
        const uid = location?.state?.id;

        const payload = {
          ...data,
          campaign_info: {
            campaignName: data?.campaignName,
            trafficSource: data?.trafficSource,
            epc: data?.epc,
            cpc: data?.cpc,
            comment: data?.comment,
          },
        };

        const res = await apiFunction(
          "patch",
          `${createCampaignApi}/${uid}`,
          null,
          payload
        );

        showSuccessToast("Campaign updated successfully!");
        navigate("/Dashboard/campaign-integration", {
          state: {
            mode: "edit",
            id: uid,
            data: location.state.data,
          },
        });
      } else {
        const response = await apiFunction(
          "post",
          createCampaignApi,
          null,
          data
        );

        // use response to show success
        showSuccessToast(
          "Campaign created successfully! you are going to route to Integration page"
        );
        navigate("/Dashboard/campaign-integration", {
          state: {
            mode: "edit",
            data: response?.data?.data || response,
          },
        });
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      showCustomAlert("Error creating campaign. See console for details.");
    }
  };

  /* ===========================
     Visual: stepper and card layout
     =========================== */

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            {location?.state?.mode === "edit" ? "Update" : "Create"} Campaign
          </h1>

          <p className="mt-2 text-base text-slate-500 max-w-2xl">
            Build, optimize, and control campaigns with enterprise-grade
            routing, cloaking, and traffic intelligence.
          </p>
        </div>

        {/* Stepper */}
        <nav className="mb-16">
          <ol className="relative flex items-start justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const active = idx + 1 === step;
              const completed = idx + 1 < step;

              return (
                <li
                  key={s.id}
                  onClick={() => handleStepClick(idx + 1)}
                  className="relative flex flex-col items-center flex-1 cursor-pointer group"
                >
                  {/* CONNECTING LINE */}
                  {idx !== steps.length - 1 && (
                    <div
                      className={`absolute top-7 left-1/2 w-full h-[2px]
                ${
                  completed
                    ? "bg-emerald-500"
                    : "bg-slate-200 group-hover:bg-slate-300"
                }
              `}
                    />
                  )}

                  {/* ICON CIRCLE */}
                  <div
                    className={`relative z-10 flex items-center justify-center h-14 w-14 rounded-full border transition-all duration-300
              ${
                active
                  ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30 scale-105"
                  : completed
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-white border-slate-300 group-hover:border-slate-400"
              }
            `}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        active || completed ? "text-white" : "text-slate-500"
                      }`}
                    />
                  </div>

                  {/* STEP NUMBER */}
                  <span className="mt-4 text-[11px] uppercase tracking-widest text-slate-400">
                    Step {idx + 1}
                  </span>

                  {/* STEP TITLE */}
                  <span
                    className={`mt-1 text-sm font-medium text-center max-w-[130px]
              ${
                active
                  ? "text-slate-900"
                  : "text-slate-500 group-hover:text-slate-700"
              }
            `}
                  >
                    {s.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Form container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Campaign Info */}
          {step === 1 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.06)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Campaign Details
                  </h2>

                  <InputField
                    label="Campaign Name"
                    name="campaignName"
                    register={register}
                    error={errors.campaignName}
                    required
                    placeholder="Enter a unique name"
                    tooltip="Enter Desired Campaign Name to identify it"
                  />
                  <InputField
                    label="Comment"
                    name="comment"
                    register={register}
                    error={errors.comment}
                    placeholder="Add a brief description"
                    tooltip="Comment for this campaign"
                  />

                  <SelectField
                    label="Traffic Source"
                    name="trafficSource"
                    register={register}
                    error={errors.trafficSource}
                    required
                    tooltip="Traffic Source like Google Ads"
                    options={adPlatforms}
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Financials & Status
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="EPC (Earnings Per Click)"
                      name="epc"
                      register={register}
                      error={errors.epc}
                      placeholder="0.00"
                      type="number"
                      icon={<span className="text-sm">$</span>}
                      tooltip="Earnings Per Click"
                    />
                    <InputField
                      label="CPC (Cost Per Click)"
                      name="cpc"
                      register={(name) =>
                        register(name, {
                          min: { value: 0, message: "CPC cannot be negative" },
                        })
                      }
                      error={errors.cpc}
                      placeholder="0.00"
                      type="number"
                      icon={<span className="text-sm">$</span>}
                      tooltip="Cost Per Click"
                      step="0.1"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="flex items-center text-sm font-medium text-gray-800 mb-3">
                      Campaign Status{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {statusOptions.map((opt) => (
                        <StatusButton
                          key={opt.name}
                          label={opt.name}
                          Icon={opt.icon}
                          isActive={activeStatus === opt.name}
                          onClick={() => setActiveStatus(opt.name)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div></div>
                {location?.state?.mode === "edit" ? (
                  <button
                    type="button"
                    // onClick={() => {
                    //   showCustomAlert(
                    //     "You can preview changes before creating campaign"
                    //   );
                    // }}
                    onClick={handleSubmit(onSubmit)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md cursor-pointer"
                  >
                    <svg
                      class="svg-inline--fa fa-floppy-disk me-2"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="floppy-disk"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"
                      ></path>
                    </svg>
                    <span>Save Changes</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition"
                >
                  Proceed <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Money Pages */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <div className="space-y-8">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b pb-5">
                  <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                    Money Pages (Traffic Destination)
                  </h2>

                  <label className="flex items-center gap-3 text-slate-700">
                    <span className="text-sm font-medium">Append URL</span>
                    <input
                      type="checkbox"
                      checked={appendUrl}
                      onChange={() => setAppendUrl((v) => !v)}
                      className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>

                {/* APPEND URL */}
                {appendUrl && (
                  <InputField
                    label="APPEND URL VALUE"
                    name="append_url"
                    register={register}
                    placeholder="utm_source=google&utm_campaign=sales"
                    tooltip="Add query parameters to money page URL"
                  />
                )}

                {/* MONEY PAGES */}
                <div className="space-y-2">
                  {/* ADD BUTTON */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={addMoneyPage}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
                      text-blue-600 border border-blue-200 rounded-xl
                      hover:bg-blue-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Page
                    </button>
                  </div>

                  {Array.isArray(moneyPages) && moneyPages.length > 0 ? (
                    moneyPages.map((page, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-5 items-end">
                          {/* URL */}
                          <InputField
                            label="Money Page URL"
                            name={`money_page.${index}.url`}
                            register={register}
                            error={errors.money_page?.[index]?.url}
                            required
                            placeholder="https://www.example.com"
                            pattern={{
                              value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                              message: "Enter a valid URL",
                            }}
                            tooltip="Destination URL for legit traffic"
                          />

                          {/* DESCRIPTION */}
                          <InputField
                            label="Description"
                            name={`money_page.${index}.description`}
                            register={register}
                            placeholder="Main sales page"
                            defaultValue={page.description || ""}
                            tooltip="Visible in analytics & reports"
                          />

                          {/* WEIGHT */}
                          <InputField
                            label="Weight"
                            name={`money_page.${index}.weight`}
                            register={register}
                            error={errors.money_page?.[index]?.weight}
                            placeholder="100"
                            type="number"
                            tooltip="Traffic distribution priority"
                          />

                          {/* REMOVE BUTTON */}
                          {moneyPages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMoneyPage(index)}
                              className="h-11 w-11 flex items-center justify-center
                rounded-xl border border-red-200 text-red-600
                hover:bg-red-50 transition shrink-0"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No money pages added.
                    </p>
                  )}
                </div>

                {/* DYNAMIC VARIABLES */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  {/* HEADER */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      Dynamic variables
                      <Tooltip title="Dynamic variables are used to track custom parameters of money page">
                        <span className="text-slate-500">
                          <Info className="w-4 h-4" />
                        </span>
                      </Tooltip>
                    </h3>

                    <p className="text-slate-500 text-sm mt-1">
                      Define variables and use [[name]] in money pages.
                    </p>
                  </div>

                  {/* ADD BUTTON — MUST BE HERE */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => addDynamicVariable()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
        text-blue-600 border border-blue-200 rounded-xl
        hover:bg-blue-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add variable
                    </button>
                  </div>

                  {/* VARIABLES */}
                  <div className="space-y-4">
                    {dynamicVariables.map((variable, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end
          bg-white p-4 rounded-xl border border-slate-200"
                      >
                        <InputField
                          label="VARIABLE NAME"
                          name={`money_variable.${idx}.name`}
                          register={register}
                          placeholder="Enter variable name"
                          defaultValue={variable.name}
                        />

                        <InputField
                          label="VARIABLE VALUE"
                          name={`money_variable.${idx}.value`}
                          register={register}
                          placeholder="Enter variable value"
                          defaultValue={variable.value}
                        />

                        <button
                          type="button"
                          onClick={() => removeDynamicVariable(idx)}
                          className="h-11 w-11 flex items-center justify-center
            rounded-xl border border-red-200 text-red-600
            hover:bg-red-50 transition shrink-0"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 text-sm font-semibold rounded-xl
            border border-slate-300 text-slate-700
            hover:bg-slate-100 transition"
                  >
                    ‹ Previous
                  </button>

                  <div className="flex gap-4">
                    {location?.state?.mode === "edit" && (
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="px-6 py-3 text-sm font-semibold rounded-xl
                bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        Save Changes
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 text-sm font-semibold rounded-xl
              bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </div>

              {showAlert && (
                <CustomAlertModal
                  message={alertMessage}
                  onClose={hideCustomAlert}
                />
              )}
            </div>
          )}

          {/* Step 3: Safe Page */}
          {step === 3 && (
            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              <div className="space-y-10">
                {/* HEADER */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Safe Page Configuration
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Configure safe page URL and tracking variables
                  </p>
                </div>

                {/* SAFE PAGE URL */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <InputField
                    label="Safe Page URL"
                    name="safe_page"
                    register={register}
                    error={errors.safe_page}
                    required
                    placeholder="https://www.youtube.com"
                    defaultValue="https://www.youtube.com"
                    pattern={{
                      value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                      message: "Enter a valid URL",
                    }}
                    tooltip="Safe page where bots or reviewers are redirected"
                  />
                </div>

                {/* VARIABLES */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                  {/* TITLE + ADD BUTTON */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        Dynamic Variables
                        <Tooltip title="Used for tracking custom parameters on safe page">
                          <Info className="w-4 h-4 text-slate-400" />
                        </Tooltip>
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Define query parameters for safe page
                      </p>
                    </div>

                    {/* ADD VARIABLE BUTTON (LEFT-ALIGNED FEEL) */}
                    <button
                      type="button"
                      onClick={addDynamicVariable}
                      className="inline-flex items-center gap-2 px-4 h-[40px]
            rounded-full border border-blue-200
            text-blue-600 text-sm font-medium
            hover:bg-blue-50 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Variable
                    </button>
                  </div>

                  {/* VARIABLES LIST */}
                  {dynamicVariables.map((variable, idx) => (
                    <div
                      key={idx}
                      className="relative grid grid-cols-1 md:grid-cols-3 gap-5
            rounded-2xl border border-slate-200 p-5 bg-slate-50"
                    >
                      <InputField
                        label="VARIABLE NAME"
                        name={`safe_page_variable.${idx}.name`}
                        register={register}
                        placeholder="utm_source"
                        defaultValue={variable.name}
                      />

                      <InputField
                        label="VARIABLE VALUE"
                        name={`safe_page_variable.${idx}.value`}
                        register={register}
                        placeholder="google"
                        defaultValue={variable.value}
                      />

                      {/* REMOVE BUTTON */}
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={() => removeDynamicVariable(idx)}
                          className="h-[42px] w-[42px] flex items-center justify-center
                rounded-xl border border-red-200
                text-red-500 hover:bg-red-50 transition"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 h-[44px] rounded-xl
          bg-slate-800 text-white text-sm font-medium
          hover:bg-slate-700 transition"
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-3">
                    {location?.state?.mode === "edit" && (
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="px-6 h-[44px] rounded-xl
              bg-emerald-600 text-white text-sm font-semibold
              hover:bg-emerald-700 transition shadow-md"
                      >
                        Save Changes
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 h-[44px] rounded-xl
            bg-blue-600 text-white text-sm font-semibold
            hover:bg-blue-700 transition shadow-md"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Conditions */}
          {step === 4 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="space-y-4">
                {/* HEADER */}
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Traffic Conditions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Define rules for filtering incoming traffic
                  </p>
                </div>

                {/* ADD CONDITION */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddCondition(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="h-9 w-56 px-3 text-sm rounded-md border border-slate-300
        bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Add condition</option>
                  {OPTIONS.filter((o) => !selectedTypes.includes(o.value)).map(
                    (opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    )
                  )}
                </select>

                {/* CONDITIONS */}
                <div className="space-y-3">
                  {fields.map((fieldItem, idx) => {
                    const currentType = fieldItem.type;

                    let dataList = [];
                    if (currentType === "country") dataList = COUNTRY_LIST;
                    if (currentType === "browser") dataList = BROWSER_LIST;
                    if (currentType === "Device") dataList = DEVICE_LIST;

                    const isDropdown = [
                      "country",
                      "browser",
                      "Device",
                    ].includes(currentType);

                    return (
                      <div
                        key={fieldItem.id}
                        className="border border-slate-200 rounded-lg p-4 bg-white"
                      >
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase text-slate-600">
                            {currentType}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>

                        {/* MODE */}
                        <Controller
                          control={control}
                          name={`conditions.${idx}.mode`}
                          render={({ field }) => (
                            <div className="inline-flex rounded-md border border-slate-300 overflow-hidden mb-3">
                              {["allow", "block"].map((mode) => (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() => field.onChange(mode)}
                                  className={`px-3 h-8 text-xs font-medium transition
                        ${
                          field.value === mode
                            ? mode === "allow"
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          )}
                        />

                        {/* VALUES */}
                        <Controller
                          control={control}
                          name={`conditions.${idx}.values`}
                          render={({ field }) => (
                            <div className="space-y-2">
                              {/* CHIPS */}
                              <div className="flex flex-wrap gap-1.5">
                                {field.value?.map((val, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1
                          bg-slate-100 text-slate-700 px-2 py-0.5
                          text-xs rounded-md border"
                                  >
                                    {val}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        field.onChange(
                                          field.value.filter(
                                            (_, id) => id !== i
                                          )
                                        )
                                      }
                                      className="text-slate-400 hover:text-slate-600"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>

                              {/* INPUT */}
                              {isDropdown ? (
                                <select
                                  className="w-full h-9 px-3 text-sm rounded-md
                        border border-slate-300 bg-white
                        focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val && !field.value.includes(val)) {
                                      field.onChange([...field.value, val]);
                                    }
                                    e.target.value = "";
                                  }}
                                >
                                  <option value="">Select {currentType}</option>
                                  {dataList.map((item) => (
                                    <option
                                      key={item.id}
                                      value={
                                        item.country ||
                                        item.state ||
                                        item.name ||
                                        item.browser ||
                                        item.device
                                      }
                                    >
                                      {item.country ||
                                        item.state ||
                                        item.name ||
                                        item.browser ||
                                        item.device}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  placeholder={`Enter ${currentType}`}
                                  className="w-full h-9 px-3 text-sm rounded-md
                        border border-slate-300 bg-white
                        focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      e.target.value.trim()
                                    ) {
                                      e.preventDefault();
                                      field.onChange([
                                        ...field.value,
                                        e.target.value.trim(),
                                      ]);
                                      e.target.value = "";
                                    }
                                  }}
                                />
                              )}
                            </div>
                          )}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="h-9 px-4 text-sm rounded-md
          bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {location?.state?.mode === "edit" && (
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="h-9 px-4 text-sm rounded-md
              bg-slate-900 text-white hover:bg-slate-800"
                      >
                        Save
                      </button>
                    )}
                    {fields.length > 0 && (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="h-9 px-4 text-sm rounded-md
              bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Filters */}
          {step === 5 && (
            <div className="bg-white border border-slate-800 rounded-2xl p-6 shadow-2xl w-full">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Controller
                    name="filters"
                    control={control}
                    render={({ field }) => {
                      const [availableOptions, setAvailableOptions] = useState(
                        fixedOptions.filter(
                          (opt) =>
                            !(field.value || []).some(
                              (sel) => sel.id === opt.id
                            )
                        )
                      );
                      const [selectedOptions, setSelectedOptions] = useState(
                        field.value || []
                      );
                      const [selectedLeft, setSelectedLeft] = useState([]);
                      const [selectedRight, setSelectedRight] = useState([]);

                      const moveRight = () => {
                        const moved = availableOptions.filter((o) =>
                          selectedLeft.includes(o.id.toString())
                        );
                        const updatedSelected = [...selectedOptions, ...moved];
                        setSelectedOptions(updatedSelected);
                        setAvailableOptions(
                          availableOptions.filter(
                            (o) => !selectedLeft.includes(o.id.toString())
                          )
                        );
                        setSelectedLeft([]);
                        setValue("filters", updatedSelected);
                      };
                      const moveLeft = () => {
                        const moved = selectedOptions.filter((o) =>
                          selectedRight.includes(o.id.toString())
                        );
                        const updatedAvailable = [
                          ...availableOptions,
                          ...moved,
                        ];
                        const updatedSelected = selectedOptions.filter(
                          (o) => !selectedRight.includes(o.id.toString())
                        );
                        setAvailableOptions(updatedAvailable);
                        setSelectedOptions(updatedSelected);
                        setSelectedRight([]);
                        setValue("filters", updatedSelected);
                      };
                      const moveAllRight = () => {
                        const updatedSelected = [
                          ...selectedOptions,
                          ...availableOptions,
                        ];
                        setSelectedOptions(updatedSelected);
                        setAvailableOptions([]);
                        setSelectedLeft([]);
                        setValue("filters", updatedSelected);
                      };
                      const moveAllLeft = () => {
                        const updatedAvailable = [
                          ...availableOptions,
                          ...selectedOptions,
                        ];
                        setAvailableOptions(updatedAvailable);
                        setSelectedOptions([]);
                        setSelectedRight([]);
                        setValue("filters", []);
                      };

                      return (
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-10">
                          {/* LEFT COLUMN */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <label className="text-gray-800 font-semibold mb-2">
                              Available Filters
                            </label>

                            <select
                              className="w-72 md:w-80"
                              multiple
                              size="8"
                              style={{
                                border: "2px solid #272d3e",
                                borderRadius: "6px",
                                padding: "4px",
                                background: "white", // optional dark background
                                color: "#0f172a",
                              }}
                              value={selectedLeft}
                              onChange={(e) =>
                                setSelectedLeft(
                                  Array.from(
                                    e.target.selectedOptions,
                                    (opt) => opt.value
                                  )
                                )
                              }
                            >
                              {availableOptions.map((item) => (
                                <option
                                  key={item.id}
                                  value={item.id}
                                  style={{ color: "#6c788b" }}
                                >
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* CENTER BUTTONS */}
                          <div
                            className="
    flex flex-row md:flex-col 
    items-center justify-center 
    gap-3 
    mt-4 md:mt-10
  "
                          >
                            <button
                              type="button"
                              onClick={moveRight}
                              className="
      w-7     h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-600 
      bg-blue-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move selected to right"
                            >
                              ›
                            </button>

                            <button
                              type="button"
                              onClick={moveLeft}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-600 
      bg-blue-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move selected to left"
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={moveAllRight}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-600 
      bg-blue-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move all right"
                            >
                              »
                            </button>

                            <button
                              type="button"
                              onClick={moveAllLeft}
                              className="
      w-7 h-7 flex items-center justify-center text-lg
      rounded-md border border-slate-600 
      bg-blue-800 hover:bg-slate-700 
      hover:border-slate-500 hover:scale-105 
      active:scale-95 transition-all duration-200
      text-slate-200  cursor-pointer
    "
                              title="Move all left"
                            >
                              «
                            </button>
                          </div>

                          {/* RIGHT COLUMN */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <label className="text-gray font-semibold mb-2">
                              Enabled Filters
                            </label>

                            <select
                              multiple
                              size="8"
                              className="w-72 md:w-80"
                              style={{
                                border: "2px solid  #272d3e",
                                borderRadius: "6px",
                                padding: "4px",
                                background: "white",
                                color: "#0f172a",
                              }}
                              value={selectedRight}
                              onChange={(e) =>
                                setSelectedRight(
                                  Array.from(
                                    e.target.selectedOptions,
                                    (opt) => opt.value
                                  )
                                )
                              }
                            >
                              {selectedOptions.map((item) => (
                                <option
                                  key={item.id}
                                  value={item.id}
                                  style={{ color: "#6c788b" }}
                                >
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
                {/* =========BUTTONS LOWER */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md cursor-pointer "
                  >
                    ‹ Previous
                  </button>
                  {location?.state?.mode === "edit" ? (
                    <button
                      type="button"
                      // onClick={() => {
                      //   showCustomAlert(
                      //     "You can preview changes before creating campaign"
                      //   );
                      // }}
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md  cursor-pointer"
                    >
                      <svg
                        class="svg-inline--fa fa-floppy-disk me-2"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="floppy-disk"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"
                        ></path>
                      </svg>
                      <span>Save Changes</span>
                    </button>
                  ) : null}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Automate */}
          {step === 6 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-6">
                {/* HEADER */}
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Automation & Safeguards
                  </h2>
                  <p className="text-sm text-slate-500">
                    Configure advanced campaign automation rules
                  </p>
                </div>

                {/* OPTIONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AFTER X */}
                  <div className="rounded-lg border border-slate-200 p-4 bg-white">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={showInputs.afterX > 0 ? true : false}
                        onChange={() =>
                          setShowInputs((p) => ({ ...p, afterX: !p.afterX }))
                        }
                        className="accent-blue-600"
                      />
                      Activate after X unique visitors
                    </label>

                    {showInputs.afterX && (
                      <div className="mt-3">
                        <InputField
                          label="Visitor count"
                          name="afterX"
                          register={register}
                          type="number"
                          placeholder="e.g. 100"
                        />
                      </div>
                    )}
                  </div>

                  {/* FREQUENCY CAP */}
                  <div className="rounded-lg border border-slate-200 p-4 bg-white">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={showInputs.frequencyCap}
                        onChange={() =>
                          setShowInputs((p) => ({
                            ...p,
                            frequencyCap: !p.frequencyCap,
                          }))
                        }
                        className="accent-blue-600"
                      />
                      Frequency cap
                    </label>

                    {showInputs.frequencyCap && (
                      <div className="mt-3">
                        <InputField
                          label="Limit"
                          name="automate.frequencyCap.value"
                          register={register}
                          type="number"
                          placeholder="e.g. 3"
                        />
                      </div>
                    )}
                  </div>

                  {/* ZERO REDIRECT */}
                  <div className="rounded-lg border border-slate-200 p-4 bg-white">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={showInputs.zeroRedirect}
                        onChange={() =>
                          setShowInputs((p) => ({
                            ...p,
                            zeroRedirect: !p.zeroRedirect,
                          }))
                        }
                        className="accent-blue-600"
                      />
                      Zero redirect cloaking
                    </label>

                    {showInputs.zeroRedirect && (
                      <div className="flex gap-6 mt-3 text-sm text-slate-700">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={watch("automate.zeroRedirect.curl")}
                            onChange={(e) => {
                              setValue(
                                "automate.zeroRedirect.curl",
                                e.target.checked
                              );
                              if (e.target.checked)
                                setValue("automate.zeroRedirect.iframe", false);
                            }}
                            className="accent-blue-600"
                          />
                          CURL
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={watch("automate.zeroRedirect.iframe")}
                            onChange={(e) => {
                              setValue(
                                "automate.zeroRedirect.iframe",
                                e.target.checked
                              );
                              if (e.target.checked)
                                setValue("automate.zeroRedirect.curl", false);
                            }}
                            className="accent-blue-600"
                          />
                          IFRAME
                        </label>
                      </div>
                    )}
                  </div>

                  {/* GCLID */}
                  <div className="rounded-lg border border-slate-200 p-4 bg-white">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        {...register("automate.gclid")}
                        className="accent-blue-600"
                      />
                      GCLID (Google Click ID)
                    </label>
                  </div>

                  {/* IP CAP */}
                  <div className="rounded-lg border border-slate-200 p-4 bg-white">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        {...register("automate.ipCap")}
                        className="accent-blue-600"
                      />
                      IP cap
                    </label>
                  </div>

                  {/* PAGE GUARD */}
                  <div className="rounded-lg border border-slate-200 p-4 bg-white md:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={showInputs.pageGuard}
                        onChange={() =>
                          setShowInputs((p) => ({
                            ...p,
                            pageGuard: !p.pageGuard,
                          }))
                        }
                        className="accent-blue-600"
                      />
                      Page Guard
                    </label>

                    {showInputs.pageGuard && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <InputField
                          label="Key"
                          name="page_guard.key"
                          register={register}
                          placeholder="Key"
                        />
                        <InputField
                          label="URL"
                          name="page_guard.url"
                          register={register}
                          error={errors.page_guard?.url}
                          placeholder="https://example.com"
                          pattern={{
                            value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                            message: "Enter a valid URL",
                          }}
                        />
                        <InputField
                          label="Second"
                          name="page_guard.second"
                          register={register}
                          placeholder="Value"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* HTTP CODE */}
                <div className="rounded-lg border border-slate-200 p-4 bg-white">
                  <div className="flex gap-6 text-sm text-slate-700">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="301"
                        {...register("http_code")}
                        className="accent-blue-600"
                      />
                      HTTP 301
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="302"
                        {...register("http_code")}
                        className="accent-blue-600"
                      />
                      HTTP 302
                    </label>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="h-9 px-4 rounded-md text-sm
          bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Previous
                  </button>

                  <button
                    type="submit"
                    className="h-9 px-5 rounded-md text-sm font-medium
          bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {location?.state?.mode === "edit" ? "Update" : "Create"}{" "}
                    Campaign
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* small footer note */}
        <div className="text-xs text-slate-500">
          Pro-tip: Use the Preview or validation to verify money pages &
          conditions before creating.
        </div>

        {showAlert && (
          <CustomAlertModal message={alertMessage} onClose={hideCustomAlert} />
        )}
      </div>
    </DashboardLayout>
  );
}
