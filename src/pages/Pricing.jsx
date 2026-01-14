import React, { useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { cryptoPayment } from "../api/Apis";
import PayPalIntegration from "./paypalIntegration";

/* ===================== DATA ===================== */

const plans = [
  {
    id: 1,
    name: "Starter",
    basePrice: 19,
    campaigns: "1 Campaign",
    clicks: "1,000 Clicks",
    features: [
      "VPN / Proxy Protection",
      "Bot Protection",
      "Block Empty Referrer",
      "Block Blacklist IP's",
      "Country Targeting",
      "Device Targeting",
      "OS Targeting",
      "Download Report",
      "Realtime Click Report",
    ],
  },
  {
    id: 2,
    name: "Pro",
    basePrice: 99,
    campaigns: "5 Campaigns",
    clicks: "5,000 Clicks",
    popular: true,
    features: [
      "VPN / Proxy Protection",
      "Bot Protection",
      "Block Empty Referrer",
      "Block Blacklist IP's",
      "Country Targeting",
      "Device Targeting",
      "OS Targeting",
      "Download Report",
      "Realtime Click Report",
      "Safe Page",
      "Money Page",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    basePrice: 149,
    campaigns: "20 Campaigns",
    clicks: "Unlimited Clicks",
    features: [
      "VPN / Proxy Protection",
      "Bot Protection",
      "Block Empty Referrer",
      "Block Blacklist IP's",
      "Country Targeting",
      "Device Targeting",
      "OS Targeting",
      "Download Report",
      "Realtime Click Report",
      "Safe Page",
      "Money Page",
    ],
  },
];

const discounts = {
  Monthly: 0,
  quarterly: 10,
  Yearly: 20,
};

const PAYMENT_DETAILS = {
  ERC20: {
    address: "0x8A8e46327fdA6ca4505bCBE5d7839a591ee82A32",
    qr: "/ERC.jpeg",
  },
  TRC20: {
    address: "TN26mZ3G2RyFbbUT2T7CMn42tBBX8hLo9W",
    qr: "/TRC.jpeg",
  },
};

/* ===================== COMPONENT ===================== */

export default function Pricing() {
  const [billing, setBilling] = useState("Monthly");

  // MODAL STATE
  const [modalStep, setModalStep] = useState(0); // 0=closed
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const isConfirmDisabled = !txHash.trim() || loading;

  const resetPaymentState = () => {
    setModalStep(0);
    setSelectedPlan(null);
    setPaymentMethod("");
    setNetwork("");
    setTxHash("");
    setLoading(false);
  };

  const calculateStartEndDates = (billing) => {
    const start = new Date(); // now
    const end = new Date(start);

    if (billing === "Monthly") {
      end.setMonth(end.getMonth() + 1);
    }

    if (billing === "quarterly") {
      end.setMonth(end.getMonth() + 3);
    }

    if (billing === "Yearly") {
      end.setFullYear(end.getFullYear() + 1);
    }

    return {
      start_date: start.toISOString(), // ✅ UTC
      end_date: end.toISOString(), // ✅ UTC
    };
  };

  /* ===== PRICE LOGIC (UNCHANGED) ===== */
  const calculateMonthlyPrice = (price) => {
    const discount = discounts[billing];
    return Math.round(price - (price * discount) / 100);
  };
  const getBillingMultiplier = () => {
    if (billing === "quarterly") return 3;
    if (billing === "Yearly") return 12;
    return 1; // Monthly
  };
  const MonthlyPrice = selectedPlan
    ? calculateMonthlyPrice(selectedPlan.basePrice)
    : 0;

  const totalAmount = MonthlyPrice * getBillingMultiplier();

  const makeCryptoPayment = async (payload) => {
    const response = await apiFunction("post", cryptoPayment, null, payload);
    return response;
  };

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-semibold tracking-tight">
            Choose Plan accordingly
          </h1>
          {/* <p className="text-gray-500 mt-3">
            Choose the plan that fits your business needs
          </p> */}
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-16">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 shadow-sm">
            {["Monthly", "quarterly", "Yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBilling(type)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                billing === type
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
              >
                {type}
                {type !== "Monthly" && (
                  <span className="ml-2 text-xs text-emerald-600 font-medium">
                    {discounts[type]}% OFF
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-2xl p-8 border transition-all
            ${
              plan.popular
                ? "border-blue-500 shadow-[0_25px_60px_rgba(37,99,235,0.15)] scale-[1.02]"
                : "border-gray-200 shadow-sm hover:shadow-md"
            }
          `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 
              bg-blue-600 text-white text-xs px-4 py-1 rounded-full shadow"
                >
                  Most Popular
                </span>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-gray-900">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  ${calculateMonthlyPrice(plan.basePrice)}
                </span>
                <span className="text-sm text-gray-500 mb-1">/ month</span>
              </div>

              {/* Sub info */}
              <p className="mt-3 text-sm text-gray-500">
                {plan.campaigns} • {plan.clicks}
              </p>

              {/* Divider */}
              <div className="my-6 h-px bg-gray-200" />

              {/* Features */}
              <ul className="space-y-3 text-sm text-gray-700">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-[2px] text-emerald-500">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setModalStep(1);
                }}
                className={`mt-8 w-full py-3 rounded-xl text-sm font-medium transition cursor-pointer
              ${
                plan.popular
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }
            `}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {modalStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          {/* Glow layer */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          </div>

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)] border border-gray-200 overflow-hidden">
            {/* Top subtle gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="p-8">
              {/* Close */}
              <button
                onClick={resetPaymentState}
                className="absolute top-5 right-5 h-9 w-9 rounded-full
                     flex items-center justify-center
                     bg-gray-100 hover:bg-gray-200
                     text-gray-500 hover:text-gray-800
                     transition cursor-pointer"
              >
                ✕
              </button>

              {/* ================= STEP 1 ================= */}
              {modalStep === 1 && (
                <>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Confirm your purchase
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Activate{" "}
                    <span className="font-medium text-gray-900">
                      {selectedPlan.name}
                    </span>
                  </p>

                  <div className="mt-8 space-y-4">
                    {[
                      {
                        id: "USDT",
                        label: "USDT Crypto",
                        desc: "Pay using blockchain",
                      },
                      {
                        id: "card",
                        label: "Card",
                        desc: "Secure card payment",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`group flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition
                    ${
                      paymentMethod === opt.id
                        ? "border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                        : "border-gray-200 hover:bg-gray-50"
                    }
                  `}
                      >
                        <input
                          type="radio"
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {opt.label}
                          </p>
                          <p className="text-xs text-gray-500">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-between items-center">
                    <button
                      onClick={() => setModalStep(0)}
                      className="text-sm text-gray-500 hover:text-gray-800"
                    >
                      Cancel
                    </button>

                    <button
                      disabled={!paymentMethod}
                      onClick={() => setModalStep(2)}
                      className={`px-6 py-3 rounded-xl text-sm font-medium transition
                  ${
                    paymentMethod
                      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                    >
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* ================= STEP 2 (USDT) ================= */}
              {modalStep === 2 && paymentMethod === "USDT" && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Choose network
                  </h2>

                  <div className="mt-8 space-y-4">
                    {["ERC20", "TRC20"].map((n) => (
                      <label
                        key={n}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition
                    ${
                      network === n
                        ? "border-indigo-500 bg-indigo-50 shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                        : "border-gray-200 hover:bg-gray-50"
                    }
                  `}
                      >
                        <input
                          type="radio"
                          checked={network === n}
                          onChange={() => setNetwork(n)}
                        />
                        <span className="font-medium">{n}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button
                      onClick={() => setModalStep(1)}
                      className="text-sm text-gray-500 hover:text-gray-800"
                    >
                      ← Back
                    </button>

                    <button
                      disabled={!network}
                      onClick={() => setModalStep(3)}
                      className={`px-6 py-3 rounded-xl text-sm font-medium transition
                  ${
                    network
                      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                    >
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* ================= STEP 3 ================= */}
              {modalStep === 3 && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Complete payment
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    USDT on <b>{network}</b> network
                  </p>

                  <img
                    src={PAYMENT_DETAILS[network].qr}
                    className="mx-auto mt-8 w-40 rounded-xl border shadow-sm"
                  />

                  <div className="mt-6 space-y-4">
                    <input
                      disabled
                      value={`${totalAmount} USDT`}
                      className="w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm"
                    />

                    <input
                      disabled
                      value={PAYMENT_DETAILS[network].address}
                      className="w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm"
                    />

                    <input
                      placeholder="Transaction hash"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button
                      onClick={() => setModalStep(2)}
                      className="text-sm text-gray-500 hover:text-gray-800"
                    >
                      ← Back
                    </button>

                    <button
                      disabled={!txHash.trim() || loading}
                      // onClick={/* SAME HANDLER */}
                      className={`px-7 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2
                  ${
                    !txHash.trim() || loading
                      ? "bg-gray-200 text-gray-400"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl"
                  }
                `}
                    >
                      {loading ? "Processing…" : "Confirm Payment"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
