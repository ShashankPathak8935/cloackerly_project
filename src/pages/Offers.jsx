import { ArrowUpRight, Sparkles, Clock, BadgeCheck,Crown, Calendar, CheckCircle  } from "lucide-react";
import { useEffect, useState } from "react";

export default function Offers() {
  const currentPlan = "Starter";
  const upgradePlan = "Pro";



  const OFFER_DURATION = 12 * 60 * 60 * 1000; // 48 hours in ms

const [timeLeft, setTimeLeft] = useState(OFFER_DURATION);

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1000) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1000;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);



const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

  return (
    <div className="bg-white min-h-screen p-6 mt-5 space-y-8">

      
     <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white shadow-lg">

  {/* glow effect */}
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"></div>

  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    {/* LEFT CONTENT */}
    <div className="space-y-2 max-w-xl">
      <div className="flex items-center gap-3">
        <Sparkles size={20} />
        <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
          Limited Offer
        </span>
      </div>

      <h2 className="text-xl font-semibold">
        Exclusive Upgrade Deal 🎉
      </h2>

      <p className="text-sm opacity-90">
        Upgrade your plan today and unlock advanced protection,
        unlimited clicks tracking and realtime analytics with a
        special discount.
      </p>

      {/* COUNTDOWN */}
{/* <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1.5 rounded-lg text-xs font-semibold">
  <Clock size={14} />
  Deal ends in
  <span className="tracking-widest ml-1">
    {formatTime(timeLeft)}
  </span>
</div> */}
    </div>
     <div className="flex flex-col items-start md:items-end gap-2">

    <p className="text-xs font-semibold uppercase opacity-80">
      Deal Ends In
    </p>

    <div className="flex items-center gap-2">
      {formatTime(timeLeft)
        .split(":")
        .map((val, index) => (
          <div
            key={index}
            className="bg-white text-gray-900 shadow-md rounded-lg px-3 py-2 min-w-[48px] text-center"
          >
            <span className="text-lg font-bold tracking-widest">
              {val}
            </span>
          </div>
        ))}
    </div>

  </div>


    {/* RIGHT CTA */}
    <div className="flex flex-col items-start md:items-end gap-3">

      <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-semibold hover:scale-105 transition shadow">
        Upgrade Now
      </button>

      <span className="text-xs opacity-80">
        Save up to <span className="font-semibold">20%</span> today
      </span>

    </div>

  </div>
</div>

      {/* ================= CURRENT PLAN ================= */}
     <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-5">
    
    <div className="flex items-center gap-2">
      <Crown className="text-indigo-600" size={18} />
      <h3 className="text-gray-800 font-semibold">
        Your Current Plan
      </h3>
    </div>

    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
      Active
    </span>

  </div>

  {/* PLAN INFO */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

    <div className="space-y-1">

      <p className="text-lg font-semibold text-gray-900">
        {currentPlan} Plan
      </p>

      <p className="text-sm text-gray-500">
        1 Campaign • 10,000 clicks/day
      </p>

      <p className="text-xs text-gray-400">
        VPN Protection • Bot Protection • Web Analytics
      </p>

    </div>

    {/* EXPIRY */}
    <div className="flex items-center gap-2 bg-orange-50 text-orange-600 text-sm px-3 py-2 rounded-lg">

      <Calendar size={16} />

      <span>
        Expires in <span className="font-semibold">15 days</span>
      </span>

    </div>

  </div>

</div>

      {/* ================= SMART SUGGESTION ================= */}
     <div className="bg-white rounded-2xl border border-indigo-200 p-7 shadow-sm">

  {/* HEADER */}
  <div className="flex items-center gap-2 mb-8 text-indigo-600">
    <BadgeCheck size={18} />
    <h3 className="font-semibold text-lg">
      Exclusive Upgrade Benefits
    </h3>
  </div>

  {/* GRID */}
  <div className="grid md:grid-cols-3 gap-6">

    {/* MONTHLY */}
    <div className="relative border rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

      <h4 className="font-semibold text-gray-900 text-lg mb-1">
        Monthly Plan
      </h4>

      <p className="text-gray-500 text-sm mb-4">$49 / month</p>

      <ul className="space-y-3 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          24/7 Technical Support
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          Quick Campaign Setup Help
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          Developer Integration Help
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          Priority Email Support
        </li>
      </ul>

      <button className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
        Choose Plan
        <ArrowUpRight size={16}/>
      </button>

    </div>


    {/* QUARTERLY */}
    <div className="relative border rounded-2xl p-6 bg-indigo-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">
        Most Popular
      </span>

      <h4 className="font-semibold text-gray-900 text-lg mb-1">
        Quarterly Plan
      </h4>

      <p className="text-gray-500 text-sm mb-4">
        $49 × 3 months
        <span className="ml-2 text-green-600 font-semibold">
          10% OFF
        </span>
      </p>

      <ul className="space-y-3 text-sm text-gray-600">

        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          Everything in Monthly
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          Dedicated Setup Assistance
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          Live Google Meet Support
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500"/>
          Campaign Optimization Tips
        </li>

      </ul>

      <button className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
        Choose Plan
        <ArrowUpRight size={16}/>
      </button>

    </div>


    {/* YEARLY */}
    <div className="relative border rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <span className="absolute -top-3 right-4 text-xs bg-white text-indigo-600 px-3 py-1 rounded-full font-semibold">
        Best Value
      </span>

      <h4 className="font-semibold text-lg mb-1">
        Yearly Plan
      </h4>

      <p className="text-sm mb-4 opacity-90">
        $49 × 12 months
        <span className="ml-2 font-semibold">
          20% OFF
        </span>
      </p>

      <ul className="space-y-3 text-sm">

        <li className="flex items-center gap-2">
          <CheckCircle size={16}/>
          Everything in Quarterly
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16}/>
          Dedicated Developer Support
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16}/>
          Custom Feature Adjustments
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16}/>
          Direct Meet Anytime
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={16}/>
          Priority Feature Requests
        </li>

      </ul>

      <button className="mt-6 w-full bg-white text-indigo-600 py-2.5 rounded-lg hover:scale-105 transition flex items-center justify-center gap-2">
        Choose Plan
        <ArrowUpRight size={16}/>
      </button>

    </div>

  </div>

</div>





<div className="relative border rounded-2xl p-6 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

  {/* BADGE */}
  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
    Most Popular
  </span>

  {/* TITLE */}
  <h4 className="text-lg font-semibold text-gray-900 mb-1">
    Pro Plan
  </h4>

  <p className="text-sm text-gray-500 mb-5">
    10 Campaigns • Unlimited Clicks
  </p>

  {/* ================= PRICING OPTIONS ================= */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    {/* MONTHLY */}
    <div className="border rounded-xl p-4 bg-gray-50 hover:border-indigo-400 transition">
      <p className="text-sm font-semibold text-gray-700">Monthly</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">$99</p>
      <p className="text-xs text-gray-500 mb-3">per month</p>

      <ul className="text-xs text-gray-600 space-y-1">
        <li>✔ Priority Live Support</li>
        <li>✔ Developer Assistance</li>
        <li>✔ Instant Setup Help</li>
      </ul>
    </div>

    {/* QUARTERLY */}
    <div className="border rounded-xl p-4 bg-indigo-50 border-indigo-300 hover:border-indigo-500 transition">
      <p className="text-sm font-semibold text-indigo-700">Quarterly</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">$249</p>
      <p className="text-xs text-gray-500 mb-3">every 3 months</p>

      <ul className="text-xs text-gray-600 space-y-1">
        <li>✔ 10% Discount</li>
        <li>✔ Dedicated Support</li>
        <li>✔ Custom Rule Setup</li>
      </ul>
    </div>

    {/* YEARLY */}
    <div className="border rounded-xl p-4 bg-green-50 border-green-300 hover:border-green-500 transition">
      <p className="text-sm font-semibold text-green-700">Yearly</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">$899</p>
      <p className="text-xs text-gray-500 mb-3">per year</p>

      <ul className="text-xs text-gray-600 space-y-1">
        <li>✔ 2 Months Free</li>
        <li>✔ 24×7 Premium Support</li>
        <li>✔ Google Meet Anytime</li>
        <li>✔ Custom Feature Requests</li>
      </ul>
    </div>

  </div>

  {/* ================= FEATURES ================= */}
 

  {/* BUTTON */}
  <button className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition">
    Upgrade to Pro
  </button>

</div>
<div className="relative border rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">

  {/* BADGE */}
  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-xs px-3 py-1 rounded-full font-semibold">
    Enterprise
  </span>

  {/* TITLE */}
  <h4 className="text-lg font-semibold mb-1">
    Enterprise Plan
  </h4>

  <p className="text-sm opacity-90 mb-5">
    Unlimited Campaigns • Unlimited Clicks
  </p>

  {/* PRICING OPTIONS */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    {/* MONTHLY */}
    <div className="bg-white text-gray-900 rounded-xl p-4">
      <p className="text-sm font-semibold">Monthly</p>
      <p className="text-2xl font-bold mt-1">$149</p>
      <p className="text-xs text-gray-500 mb-3">per month</p>

      <ul className="text-xs space-y-1 text-gray-600">
        <li>✔ Premium Support</li>
        <li>✔ Priority Server Access</li>
        <li>✔ Instant Campaign Setup</li>
      </ul>
    </div>

    {/* QUARTERLY */}
    <div className="bg-indigo-50 text-gray-900 rounded-xl p-4 border border-indigo-300">
      <p className="text-sm font-semibold text-indigo-700">Quarterly</p>
      <p className="text-2xl font-bold mt-1">$399</p>
      <p className="text-xs text-gray-500 mb-3">every 3 months</p>

      <ul className="text-xs space-y-1 text-gray-600">
        <li>✔ 15% Discount</li>
        <li>✔ Dedicated Technical Manager</li>
        <li>✔ Advanced Custom Rules</li>
      </ul>
    </div>

    {/* YEARLY */}
    <div className="bg-green-50 text-gray-900 rounded-xl p-4 border border-green-300">
      <p className="text-sm font-semibold text-green-700">Yearly</p>
      <p className="text-2xl font-bold mt-1">$1399</p>
      <p className="text-xs text-gray-500 mb-3">per year</p>

      <ul className="text-xs space-y-1 text-gray-600">
        <li>✔ 2 Months Free</li>
        <li>✔ 24×7 Dedicated Support</li>
        <li>✔ Direct Developer Access</li>
        <li>✔ Custom Feature Requests</li>
      </ul>
    </div>

  </div>

  {/* BUTTON */}
  <button className="mt-6 w-60 bg-white text-indigo-600 py-2.5 rounded-lg hover:scale-105 transition font-semibold">
    Upgrade to Enterprise
  </button>

</div>

      {/* ================= LIMITED DEAL ================= */}
     <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">

  {/* OFFER TAG */}
  <span className="absolute -top-3 left-6 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
    🔥 Limited Deal
  </span>

  {/* HEADER */}
  <div className="flex items-center gap-2 mb-4 text-orange-500">
    <div className="bg-orange-100 p-2 rounded-lg">
      <Clock size={18} />
    </div>
    <h3 className="font-semibold text-gray-900 text-lg">
      Limited Time Offer
    </h3>
  </div>

  {/* CONTENT */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

    {/* LEFT TEXT */}
    <div className="space-y-2">
      <p className="text-gray-600 text-sm leading-relaxed">
        Upgrade within{" "}
        <span className="font-semibold text-gray-900">
          48 hours
        </span>{" "}
        and unlock a special{" "}
        <span className="text-indigo-600 font-semibold">
          20% OFF
        </span>{" "}
        on yearly subscription plans.
      </p>

      {/* SMALL BENEFIT TAGS */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-gray-100  text-gray-800 px-2 py-1 rounded-md">
          Priority Support
        </span>
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
          Extra Security Layer
        </span>
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
          Bonus Analytics
        </span>
      </div>
    </div>

    {/* RIGHT CTA */}
    <div className="flex flex-col items-start md:items-end gap-2">

      <button className="
        bg-orange-500 text-white
        px-6 py-2.5
        rounded-lg
        font-semibold
        hover:bg-orange-600
        hover:scale-105
        active:scale-95
        transition-all
        shadow-sm
      ">
        Claim Deal →
      </button>

      <span className="text-xs text-gray-400">
        Ends soon • Don’t miss out
      </span>

    </div>
  </div>
</div>

      {/* ================= BENEFITS PREVIEW ================= */}
     <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

  <h3 className="text-gray-900 font-semibold text-lg mb-5">
    What You'll Unlock 🚀
  </h3>

  <div className="grid md:grid-cols-3 gap-5">

    {/* FEATURE 1 */}
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-sm transition">

      <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
        🛡️
      </div>

      <div>
        <p className="font-semibold text-gray-800 text-sm">
          Advanced Security Filters
        </p>
        <p className="text-xs text-gray-500">
          AI based bot detection and smart traffic filtering.
        </p>
      </div>

    </div>


    {/* FEATURE 2 */}
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-sm transition">

      <div className="bg-green-100 text-green-600 p-2 rounded-lg">
        📈
      </div>

      <div>
        <p className="font-semibold text-gray-800 text-sm">
          Unlimited Campaign Scaling
        </p>
        <p className="text-xs text-gray-500">
          Run unlimited campaigns without click limitations.
        </p>
      </div>

    </div>


    {/* FEATURE 3 */}
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-sm transition">

      <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
        ⚡
      </div>

      <div>
        <p className="font-semibold text-gray-800 text-sm">
          Priority Support Access
        </p>
        <p className="text-xs text-gray-500">
          Get faster response from our expert support team.
        </p>
      </div>

    </div>

  </div>

</div>

    </div>
  );
}