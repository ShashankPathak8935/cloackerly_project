import React, { useEffect, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { showErrorToast } from "../components/toast/toast";
import { cryptoPayment } from "../api/Apis";

const billingApi = "/billing"; // 👈 apna actual API path yahan daalna

const BillingPage = () => {
  const [billingList, setBillingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBillingData = async () => {
    try {
      setLoading(true);

      const userData = JSON.parse(localStorage.getItem("user"));
      //   const userId = userData?.id;

      //   if (!userId) {
      //     showErrorToast("User not logged in");
      //     return;
      //   }

      const res = await apiFunction("get", cryptoPayment, null, null);
      console.log(res);

      setBillingList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to fetch billing data");
    } finally {
      setLoading(false);
    }
  };

  const truncateId = (id, length = 16) => {
    if (!id) return "N/A";
    return id.length > length ? id.slice(0, length) + "..." : id;
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  return (
    <div
      style={{ fontFamily: "Inter, Outfit, system-ui, sans-serif" }}
      className="min-h-screen bg-gray-50 text-gray-900 px-10 py-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* ===== HEADER ===== */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Billing & Invoices
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your subscriptions and payment history
          </p>
        </div>

        {/* ===== TABLE CONTAINER ===== */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
          {/* TABLE HEAD */}
          <div
            className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_auto]
                      px-8 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide
                      bg-gray-50 border-b border-gray-200"
          >
            <div>Plan</div>
            <div>Method</div>
            <div>Amount</div>
            <div>Payment ID</div>
            <div>Status</div>
            <div>Period</div>
            <div className="text-right">Invoice</div>
          </div>

          {/* TABLE BODY */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && (
              <div className="px-8 py-10 text-center text-gray-500">
                Loading billing history…
              </div>
            )}

            {!loading && billingList.length === 0 && (
              <div className="px-8 py-10 text-center text-gray-500">
                No billing records available
              </div>
            )}

            {!loading &&
              billingList.map((item, index) => (
                <div
                  key={item.id || index}
                  className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_auto]
                          px-8 py-5 text-sm
                          border-b border-gray-100
                          hover:bg-gray-50 transition"
                >
                  {/* Plan */}
                  <div>
                    <p className="font-medium text-gray-900 truncate">
                      {item.plan_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Subscription Plan
                    </p>
                  </div>

                  {/* Method */}
                  <div className="text-gray-700">{item?.method || "N/A"}</div>

                  {/* Amount */}
                  <div className="font-medium tabular-nums">
                    ${item.amount || "N/A"}
                  </div>

                  {/* Payment ID */}
                  <div className="relative group max-w-[180px]">
                    <div className="font-mono text-xs text-gray-600 truncate cursor-default">
                      {truncateId(item.payment_id)}
                    </div>

                    {item.payment_id && (
                      <div
                        className="
        absolute z-[9999]
        top-full left-1/2 -translate-x-1/2
        hidden group-hover:block
        bg-gray-900 text-white text-xs
        px-3 py-1.5 rounded-md shadow-xl
        whitespace-nowrap
        pointer-events-none
      "
                      >
                        {item.payment_id}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${
                      item.status === "success"
                        ? "bg-emerald-50 text-emerald-600"
                        : item.status === "failed"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }
                  `}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Period */}
                  <div className="text-xs text-gray-600 leading-tight">
                    <div>
                      {item.start_date
                        ? new Date(item.start_date).toLocaleDateString("en-IN")
                        : "-"}
                    </div>
                    <div className="text-gray-400">
                      to{" "}
                      {item.end_date
                        ? new Date(item.end_date).toLocaleDateString("en-IN")
                        : "-"}
                    </div>
                  </div>

                  {/* Invoice */}
                  <div className="flex justify-end">
                    {item.invoice_url ? (
                      <button
                        onClick={() => window.open(item.invoice_url, "_blank")}
                        className="px-4 py-2 text-xs font-medium rounded-lg
                               bg-gray-900 text-white
                               hover:bg-gray-800 transition"
                      >
                        View PDF
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Not available
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
