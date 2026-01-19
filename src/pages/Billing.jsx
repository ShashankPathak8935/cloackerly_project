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
          width: "800px",
          padding: "40px",
          backgroundColor: "#ffffff",
          color: "#111827",
          fontFamily: "Outfit, Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <div>
            {/* LOGO PLACEHOLDER */}
            <div
              style={{
                width: "120px",
                height: "40px",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              LOGO
            </div>

            <h1 style={{ fontSize: "28px", margin: 0 }}>INVOICE</h1>
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
              <h3 style={{ fontSize: "16px", margin: 0 }}>Click Stopper</h3>
            </p>
          </div>

          <div
            style={{ textAlign: "right", fontSize: "12px", color: "#374151" }}
          >
            <p>
              <b>Invoice ID:</b> {item.payment_id}
            </p>
            <p>
              <b>Date:</b> {new Date(item.start_date).toLocaleDateString()}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    item.status === "Paid"
                      ? "#16a34a"
                      : item.status === "Rejected"
                      ? "#dc2626"
                      : "#d97706",
                  fontWeight: 600,
                }}
              >
                {item.status?.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        {/* BILL TO */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{ fontSize: "14px", marginBottom: "6px", color: "#111827" }}
          >
            Billed For
          </h3>
          <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
            Subscription Plan: <b>{item.plan_name || "N/A"}</b>
          </p>
          <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
            Payment Method: {item.method || "N/A"}
          </p>
        </div>

        {/* COMPANY DETAILS */}
        <div
          style={{ marginBottom: "30px", fontSize: "13px", color: "#374151" }}
        >
          <p style={{ margin: 0 }}>
            <b>Email:</b> billing@clickstopper.com
          </p>
          <p style={{ margin: 0 }}>
            <b>Phone:</b>{" "}
            <a
              href="tel:+13214188331"
              style={{ color: "#111827", textDecoration: "none" }}
            >
              +1 321-418-8331
            </a>
          </p>
          <p style={{ margin: 0 }}>
            <b>Address:</b> 5600 Tribune Way, Plano, TX 75094-4502, US
          </p>
        </div>

        {/* TABLE */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={th}>Description</th>
              <th style={th}>Period</th>
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
            marginBottom: "20px",
          }}
        >
          <div style={{ width: "250px" }}>
            <div style={totalRow}>
              <span>Subtotal</span>
              <span>${item.amount}</span>
            </div>
            <div style={totalRow}>
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div style={{ ...totalRow, fontWeight: 700, fontSize: "16px" }}>
              <span>Total</span>
              <span>${item.amount}</span>
            </div>
          </div>
        </div>

        {/* EXTRA / LEGAL CONTENT BELOW TOTAL */}
        <div
          style={{
            marginBottom: "30px",
            paddingTop: "10px",
            borderTop: "1px dashed #e5e7eb",
            fontSize: "12px",
            color: "#4b5563",
          }}
        >
          <p style={{ marginBottom: "6px" }}>
            This invoice reflects the successful processing of your subscription
            payment.
          </p>

          <p style={{ marginBottom: "6px" }}>
            All amounts are in USD. Please make the payment within 15 days from
            the issue date of this invoice.
          </p>

          <p style={{ marginBottom: "6px" }}>
            Tax is not charged on this bill as per paragraph 1 of Article 9 of
            the Value Added Tax Act.
          </p>

          <p style={{ marginBottom: "6px" }}>
            If you have any questions regarding this invoice or your
            subscription, please contact our billing team at{" "}
            <b>billing@clickstopper.com</b>.
          </p>

          <p style={{ fontStyle: "italic" }}>
            Thank you for your confidence in my work.
          </p>
        </div>

        {/* FOOTER */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
            fontSize: "11px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          This is a system generated invoice. No signature required.
          <br />© {new Date().getFullYear()} Click Stopper. All rights reserved.
        </div>
      </div>
    );
  };

  /* Styles */
  const th = {
    padding: "12px",
    fontSize: "12px",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  };

  const td = {
    padding: "12px",
    fontSize: "13px",
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
  };

  const totalRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "13px",
  };

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
