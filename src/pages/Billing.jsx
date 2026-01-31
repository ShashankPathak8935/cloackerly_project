import React, { useEffect, useState } from "react";
import { apiFunction } from "../api/ApiFunction";
import { showErrorToast } from "../components/toast/toast";
import { cryptoPayment } from "../api/Apis";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import { Download } from "lucide-react";

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

  const InvoiceTemplate = ({ item }) => {
    return (
      <div
        style={{
          width: "820px",
          backgroundColor: "#ffffff",
          fontFamily: "Outfit, Arial, sans-serif",
          color: "#0f172a",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        {/* TOP STRIP */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb, #1e40af)",
            padding: "28px 40px",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "26px", letterSpacing: "1px" }}>
                INVOICE
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: "13px", opacity: 0.9 }}>
                Clockerly.io — Subscription Billing
              </p>
            </div>

            <div style={{ textAlign: "right", fontSize: "13px" }}>
              <p style={{ margin: 0 }}>
                <b>Invoice ID:</b> {item.payment_id}
              </p>
              <p style={{ margin: "4px 0 0" }}>
                {new Date(item.start_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "40px" }}>
          {/* STATUS + SUMMARY */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Billed For</h3>
              <p style={{ margin: "6px 0", fontSize: "14px" }}>
                <b>Plan:</b> {item.plan_name || "N/A"}
              </p>
              <p style={{ margin: 0, fontSize: "14px" }}>
                <b>Payment Method:</b> {item.method || "N/A"}
              </p>
            </div>

            <div
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor:
                  item.status === "Paid"
                    ? "#dcfce7"
                    : item.status === "Rejected"
                      ? "#fee2e2"
                      : "#fef3c7",
                color:
                  item.status === "Paid"
                    ? "#166534"
                    : item.status === "Rejected"
                      ? "#991b1b"
                      : "#92400e",
              }}
            >
              {item.status?.toUpperCase()}
            </div>
          </div>

          {/* COMPANY INFO */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              marginBottom: "30px",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Clockerly.io</p>
              <p style={{ margin: "4px 0" }}>
                5600 Tribune Way, Plano, TX 75094-4502, US
              </p>
              <p style={{ margin: 0 }}>billing@clockerly.io.com</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0 }}>
                <b>Phone:</b> +1 321-418-8331
              </p>
              <p style={{ margin: "4px 0 0" }}>
                <b>Currency:</b> USD
              </p>
            </div>
          </div>

          {/* TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              marginBottom: "25px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={th}>Description</th>
                <th style={th}>Billing Period</th>
                <th style={{ ...th, textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>{item.plan_name} Subscription</td>
                <td style={td}>
                  {item.start_date
                    ? new Date(item.start_date).toLocaleDateString()
                    : "N/A"}{" "}
                  –{" "}
                  {item.end_date
                    ? new Date(item.end_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>
                  ${item.amount}
                </td>
              </tr>
            </tbody>
          </table>

          {/* TOTAL */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "30px",
            }}
          >
            <div style={{ width: "260px" }}>
              <div style={totalRow}>
                <span>Subtotal</span>
                <span>${item.amount}</span>
              </div>
              <div style={totalRow}>
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div
                style={{
                  ...totalRow,
                  fontSize: "17px",
                  fontWeight: 700,
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "10px",
                }}
              >
                <span>Total Due</span>
                <span>${item.amount}</span>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "18px 22px",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#475569",
              marginBottom: "30px",
            }}
          >
            <p style={{ margin: 0 }}>
              This invoice confirms successful processing of your subscription
              payment. No further action is required.
            </p>
            <p style={{ margin: "10px 0 0" }}>
              For billing questions or invoice clarification, please contact our
              support team at <b>billing@clockerly.io.com</b>.
            </p>
          </div>

          {/* FOOTER */}
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#64748b",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "16px",
            }}
          >
            This is a system-generated invoice. No signature required.
            <br />© {new Date().getFullYear()} Clockerly.io. All rights reserved.
          </div>
        </div>
      </div>
    );
  };

  /* SHARED STYLES */
  const th = {
    textAlign: "left",
    padding: "12px",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  };

  const td = {
    padding: "14px 12px",
    borderBottom: "1px solid #e5e7eb",
  };

  const totalRow = {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "14px",
  };

  // download invoice as PDF
  const handleDownloadInvoice = async (item) => {
    const container = document.createElement("div");

    // off-screen render
    container.style.position = "fixed";
    container.style.top = "-10000px";
    container.style.left = "-10000px";

    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<InvoiceTemplate item={item} />);

    setTimeout(async () => {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${item.payment_id}.pdf`);

      root.unmount();
      document.body.removeChild(container);
    }, 300);
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
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize
      ${
        item.status === "Paid"
          ? "bg-emerald-50 text-emerald-600"
          : item.status === "Rejected"
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
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDownloadInvoice(item)}
                      className="p-2 rounded-lg cursor-pointer bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all"
                      title="Download Invoice"
                    >
                      <Download size={18} />
                    </button>
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
