import React, { useEffect, useState } from "react";
import { apiFunction, createApiFunction } from "../api/ApiFunction";
import { cryptoPayment, getPlans } from "../api/Apis";
import PayPalIntegration from "./paypalIntegration";
import PayPalSubscription from "../components/paypalComponents/paypalSubscription";
import { CreditCard, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ===================== PAYMENT DETAILS ===================== */

const PAYMENT_DETAILS = {
  ETH: {
    address: "0x05Efa283b941708E54e26925327847399f3D00F0",
    qr: "/ETH.jpeg",
  },
  BTC: {
    address: "bc1q27zdy7pwwd4nju26tusaofxlv37d50fh0p7zp",
    qr: "/BTC.jpeg",
  },
  ERC20: {
    address: "0x05Efa283b941708E54e26925327847399f3D00F0",
    qr: "/ERC20.jpeg",
  },
  TRC20: {
    address: "TTkEHAVGPNBWzPT66jWTXW1gD5Cg2HXMob",
    qr: "/TRC20.jpeg",
  },
};

/* ===================== COMPONENT ===================== */

export default function Pricing() {
  const [billing, setBilling] = useState("Monthly");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // MODAL STATE
  const [modalStep, setModalStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);
  const navigate = useNavigate();

  /* ===================== FETCH PLANS ===================== */

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await createApiFunction("get", getPlans, null, null);
        console.log("PLANS RESPONSE 👉", res);

        if (res?.data?.success && Array.isArray(res.data.Plans)) {
          setPlans(res.data.Plans);
        }
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  /* ===================== PAYMENT HANDLERS ===================== */
  const handleSubscribe = async (priceId) => {
    if (!priceId) return alert("Price ID is required for subscription");
    try {
      const response = await fetch(
        "https://api.clockerly.io/api/v2/payment/stripe/checkout-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ planId: selectedPlan?.id, priceId: priceId }), // ₹500
        },
      );
      const data = await response.json();
      console.log("Subscription Response:", data);
      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (error) {
      console.log("Error", error);
    }
  };

  /* ===================== HELPERS ===================== */

  const resetPaymentState = () => {
    setModalStep(0);
    setSelectedPlan(null);
    setPaymentMethod("");
    setNetwork("");
    setTxHash("");
    setLoading(false);
    setPayload(null);
    navigate("/Dashboard/billing");
  };

  // currency obj
  const CURRENCY_MAP = {
    ETH: "ETH",
    BTC: "BTC",
    ERC20: "USDT (ERC20)",
    TRC20: "USDT (TRC20)",
  };

  const calculateStartEndDates = (billing) => {
    const start = new Date();
    const end = new Date(start);

    if (billing === "Monthly") end.setMonth(end.getMonth() + 1);
    if (billing === "quarterly") end.setMonth(end.getMonth() + 3);
    if (billing === "Yearly") end.setFullYear(end.getFullYear() + 1);

    return {
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };
  };

  const parseFeatures = (features) => {
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  const filteredPlans = plans.filter((plan) => {
    if (billing === "Monthly") return plan.durationInMonths === 1;
    if (billing === "quarterly") return plan.durationInMonths === 3;
    if (billing === "Yearly") return plan.durationInMonths === 12;
    return false;
  });

  const totalAmount = selectedPlan ? selectedPlan.price : 0;

  const makeCryptoPayment = async (payload) => {
    return await apiFunction("post", cryptoPayment, null, payload);
  };

  /* ===================== LOADER ===================== */

  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        Loading plans...
      </div>
    );
  }

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-white text-gray-100 px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-[32px] font-semibold text-gray-900 leading-tight">
            Simple pricing, built for growing teams
          </h1>

          <p className="mt-3 text-sm text-gray-600 max-w-md mx-auto">
            Pick a plan that matches your workflow. Upgrade or downgrade
            anytime.
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-12">
          <div className="relative flex bg-gray-100 p-1 rounded-full shadow-inner">
            {["Monthly", "quarterly", "Yearly"].map((type) => {
              const discount =
                type === "quarterly"
                  ? "10% OFF"
                  : type === "Yearly"
                    ? "20% OFF"
                    : null;

              const isActive = billing === type;

              return (
                <button
                  key={type}
                  onClick={() => setBilling(type)}
                  className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full
            transition-all duration-300 cursor-pointer
            ${
              isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
                >
                  {type}

                  {discount && (
                    <span
                      className="ml-2 text-[10px] px-2 py-[2px] rounded-full 
              bg-gray-900 text-white font-semibold"
                    >
                      {discount}
                    </span>
                  )}

                  {/* ACTIVE PILL */}
                  {isActive && (
                    <span
                      className="absolute inset-0 -z-10 rounded-full 
                bg-white shadow-sm transition-all duration-300"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white border rounded-xl p-6
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        ${
          plan.name.includes("Pro")
            ? "border-blue-500 shadow-md"
            : "border-gray-200"
        }`}
            >
              {plan.name.includes("Pro") && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 
          bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full"
                >
                  Popular
                </span>
              )}

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>

              {/* PRICE */}
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-xs text-gray-500 mb-1">/ {billing}</span>
              </div>

              {/* META */}
              <p className="mt-2 text-xs text-gray-600">
                {plan.maxCampaigns=== -1 ? "Unlimited" : plan.maxCampaigns} Campaigns •{" "}
                {plan.clicksPerCampaign === -1
                  ? "Unlimited Clicks"
                  : `10000 Clicks per day`}
              </p>

              {/* FEATURES */}
              <ul className="mt-5 space-y-2 text-xs text-gray-700">
                {parseFeatures(plan.features).map((f, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-600">•</span>
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
                className={`mt-6 w-full py-2.5 rounded-lg text-sm font-medium
          transition cursor-pointer
          ${
            plan.name.includes("Pro")
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {modalStep > 0 && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-gray-700 relative">
            <button
              onClick={resetPaymentState}
              className="absolute top-3 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* STEP 1 */}
            {modalStep === 1 && (
              <>
                {/* TITLE */}
                <h2 className="text-lg font-semibold text-gray-900">
                  Choose Your Payment Method
                </h2>

                {/* SUMMARY */}
                <p className="mt-2 text-sm text-gray-600">
                  You’re about to activate{" "}
                  <span className="font-medium text-gray-900">
                    {selectedPlan.name}
                  </span>{" "}
                  for{" "}
                  <span className="font-semibold text-blue-600">
                    ${totalAmount}
                  </span>
                </p>

                {/* PAYMENT METHODS */}
                <div className="mt-6 space-y-4">
                  {["Digital Payments", "card"].map((m) => (
                    <label
                      key={m}
                      className={`flex items-center justify-between rounded-xl border px-4 py-4 cursor-pointer transition-all
          ${
            paymentMethod === m
              ? "border-blue-600 bg-blue-50 shadow-sm"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* HD ICON */}
                        <div className="h-10 w-10 flex items-center justify-center">
                          {m === "Digital Payments" ? (
                            <img
                              src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=029"
                              alt="USDT"
                              className="h-9 w-9 object-contain"
                            />
                          ) : (
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/633/633611.png"
                              alt="Card"
                              className="h-9 w-auto object-contain"
                            />
                          )}
                        </div>

                        {/* TEXT */}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {m.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {m === "Digital Payments"
                              ? "Crypto wallet payment"
                              : "Card (Debit/credit) / Paypal payment"}
                          </p>
                        </div>
                      </div>

                      {/* RADIO */}
                      <input
                        type="radio"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m)}
                        className="accent-blue-600"
                      />
                    </label>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-4 mt-8">
                  {/* PROCEED */}
                  <button
                    disabled={!paymentMethod}
                    onClick={() => {
                      setModalStep(2);
                      if (paymentMethod === "card") {
                        // handleSubscribe(selectedPlan.stripePriceId);
                        const { start_date, end_date } =
                          calculateStartEndDates(billing);
                        setPayload({
                          plan_id: selectedPlan.id,
                          price_id: selectedPlan.stripePriceId,
                          plan_name: selectedPlan.name,
                          billing_cycle: billing,

                          method:
                            paymentMethod === "USDT"
                              ? "cryptocurrency"
                              : "card",

                          amount: totalAmount,

                          currency:
                            paymentMethod === "USDT"
                              ? network === "ERC20"
                                ? "USDT (ERC20)"
                                : "USDT (TRC20)"
                              : "USD",

                          start_date,
                          end_date,

                          payment_id: null,
                        });
                      }
                    }}
                    className={`w-full py-3 text-base font-semibold rounded-xl transition
                   ${
                     paymentMethod
                       ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                       : "bg-gray-200 text-gray-400 cursor-not-allowed"
                   }`}
                  >
                    Proceed
                  </button>

                  {/* BACK */}
                  <button
                    onClick={resetPaymentState}
                    className="w-full py-3 text-base font-medium rounded-xl border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 - USDT */}
            {modalStep === 2 && paymentMethod === "Digital Payments" && (
              <>
                {/* TITLE */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-1 rounded-full bg-green-500 mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Select Payment Currency
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Pick a blockchain network to continue your payment.
                    </p>
                  </div>
                </div>

                {/* NETWORK OPTIONS */}
                <div className="mt-2 max-h-[200px] overflow-y-auto pr-2 space-y-1">
                  {["ETH", "BTC", "ERC20", "TRC20"].map((n) => (
                    <label
                      key={n}
                      className={`flex items-center justify-between rounded-xl border px-4 py-2 cursor-pointer transition-all
          ${
            network === n
              ? "border-blue-600 bg-green-50 shadow-sm"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* NETWORK IMAGE */}
                        <div className="h-10 w-10 flex items-center justify-center">
                          {n === "ERC20" || n === "ETH" ? (
                            <img
                              src="/etherum.svg"
                              alt="Ethereum"
                              className="h-10 w-10 object-contain"
                            />
                          ) : n === "TRC20" ? (
                            <img
                              src="/trc20.svg"
                              alt="TRON"
                              className="h-10 w-10 object-contain"
                            />
                          ) : n === "BTC" ? (
                            <img
                              src="/bitcoin.svg"
                              alt="Bitcoin"
                              className="h-10 w-10 object-contain"
                            />
                          ) : (
                            <img
                              src="erc20.svg"
                              alt="BEP20"
                              className="h-10 w-10 object-contain"
                            />
                          )}
                        </div>

                        {/* TEXT */}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {n === "ERC20" || n === "TRC20" ? `${n} USDT` : n}
                          </p>
                          <p className="text-xs text-gray-500">
                            {n === "ETH" && "Native ETH transfer"}
                            {n === "BTC" && "Bitcoin Blockchain"}
                            {n === "ERC20" && "Ethereum Network"}
                            {n === "TRC20" && "TRON Network (Low fees)"}
                          </p>
                        </div>
                      </div>

                      {/* RADIO (LOGIC SAME) */}
                      <input
                        type="radio"
                        checked={network === n}
                        onChange={() => setNetwork(n)}
                        className="accent-blue-600"
                      />
                    </label>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-4 mt-8">
                  <button
                    disabled={!network}
                    onClick={() => setModalStep(3)}
                    className={`w-full px-6 py-3 text-base font-medium rounded-lg transition
        ${
          network
            ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
                  >
                    Proceed
                  </button>

                  <button
                    onClick={() => setModalStep(1)}
                    className="w-full px-6 py-3 text-base font-medium rounded-lg border border-gray-300 text-gray-800 cursor-pointer hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 - CARD */}
            {modalStep === 2 && paymentMethod === "card" && (
              <>
                <PayPalSubscription cart={payload} />

                <button
                  onClick={() => setModalStep(1)}
                  className="
    mt-6
    flex items-center justify-center gap-2
    px-6 py-2.5
    rounded-xl
    bg-gradient-to-r from-blue-600 to-indigo-600
    text-white text-sm font-semibold
    shadow-md
    cursor-pointer
    hover:from-blue-700 hover:to-indigo-700
    hover:shadow-lg
    active:scale-95
    transition-all duration-200
  "
                >
                  ← Back
                </button>
              </>
            )}

            {/* STEP 3 */}
            {modalStep === 3 && (
              <>
                {/* TITLE */}
                <h2 className="text-lg font-semibold text-gray-900">
                  Scan this Qr code to Make UPI Payment
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Send{" "}
                  <span className="font-medium text-gray-900">
                    {totalAmount} USDT
                  </span>{" "}
                  via{" "}
                  <span className="font-medium text-gray-900">{network}</span>{" "}
                  network
                </p>

                {/* QR */}
                <div className="flex justify-center mt-5">
                  <img
                    src={PAYMENT_DETAILS[network].qr}
                    alt={`${network} QR`}
                    className="w-32 h-32 rounded-lg border"
                  />
                </div>

                {/* AMOUNT */}
                <div className="mt-6">
                  <label className="text-xs font-medium text-gray-600">
                    Amount to pay
                  </label>
                  <input
                    disabled
                    value={`${totalAmount} USDT`}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-gray-50 text-gray-800"
                  />
                </div>

                {/* ADDRESS */}
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-600">
                    Payment address
                  </label>
                  <input
                    disabled
                    value={PAYMENT_DETAILS[network].address}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-gray-50 text-gray-800"
                  />
                </div>

                {/* TX HASH */}
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-600">
                    Transaction hash
                  </label>
                  <input
                    placeholder="Paste transaction hash here"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border
             text-gray-900 placeholder-gray-400
             bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => setModalStep(2)}
                    disabled={loading}
                    className="px-4 py-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                  >
                    Back
                  </button>

                  <button
                    disabled={!txHash.trim() || loading}
                    onClick={async () => {
                      if (!txHash.trim() || loading) return;

                      setLoading(true);

                      const { start_date, end_date } =
                        calculateStartEndDates(billing);

                      const payloadData = {
                        plan_id: selectedPlan.id,
                        plan_name: selectedPlan.name,
                        billing_cycle: billing,
                        method: "cryptocurrency",
                        amount: totalAmount,
                        currency: CURRENCY_MAP[network],
                        start_date,
                        end_date,
                        payment_id: txHash,
                      };

                      try {
                        const res = await makeCryptoPayment(payloadData);

                        if (res?.success || res?.status === 201) {
                          setModalStep(4);
                        }
                      } catch {
                        alert("Payment failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2
          transition
          ${
            !txHash.trim() || loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Confirm payment"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* STEP 4 - THANK YOU */}
            {modalStep === 4 && (
              <div className="px-4 text-center bg-white">
                {/* ICON */}
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment received
                </h2>

                {/* DESCRIPTION */}
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  We’ve successfully received your payment.
                  <br />
                  Our team is currently verifying the transaction.
                </p>

                {/* STATUS BOX */}
                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Status: Under review
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        This process usually completes within 24 hours. Once
                        approved, your subscription will be activated
                        automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FEATURES */}
                <div className="mt-5 grid grid-cols-1 gap-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-emerald-600">✓</span> Campaign
                    creation
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-emerald-600">✓</span> Analytics
                    dashboard
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-emerald-600">✓</span> Full plan access
                  </div>
                </div>

                {/* FOOTER */}
                <p className="mt-4 text-xs text-gray-400">
                  You’ll be notified once verification is complete.
                </p>

                {/* BUTTON */}
                <button
                  onClick={resetPaymentState}
                  className="mt-6 w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
