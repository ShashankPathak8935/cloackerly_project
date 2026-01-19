import React, { useEffect, useState } from "react";

export const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://your-api-url.com/orders"); // CHANGE TO YOUR API
        const data = await res.json();

        setOrders(data.orders); // assume { orders: [...] }
        setLoading(false);
      } catch (err) {
        setError("No Orders yet");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Order History
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your recent purchases
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && <p className="text-sm text-slate-400">Loading orders…</p>}

      {/* ERROR */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left py-3 font-medium">Order ID</th>
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Status</th>
                <th className="text-left py-3 font-medium">Amount</th>
                <th className="text-right py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No orders available
                  </td>
                </tr>
              )}

              {orders.map((o, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="py-4 font-medium text-slate-700">#{o.id}</td>

                  <td className="py-4 text-slate-500">{o.date}</td>

                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${
                      o.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : o.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="py-4 font-semibold text-slate-700">
                    {o.total}
                  </td>

                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 text-xs font-medium
                    border border-slate-200 rounded-md
                    text-slate-600 hover:bg-slate-100 transition"
                      >
                        View
                      </button>

                      <button
                        className="px-3 py-1.5 text-xs font-medium
                    border border-slate-200 rounded-md
                    text-slate-600 hover:bg-slate-100 transition"
                      >
                        Invoice
                      </button>

                      <button
                        className="px-3 py-1.5 text-xs font-medium
                    bg-orange-500 text-white rounded-md
                    hover:bg-orange-600 transition"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
