import React, { useState } from "react";

export function SupportTicketsView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "Medium",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("https://formsubmit.co/ffedefd76b08c830449f6c87dba9206a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _subject: "New Support Ticket",
          _template: "table",
          _captcha: "false",
        }),
      });

      // ✅ SUCCESS
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "Medium",
        message: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            ✅ Your support ticket has been submitted successfully. Our team
            will reach out to you shortly.
          </div>
        )}

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 space-y-5"
        >
          {/* HEADER */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Contact Support
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tell us what you need help with and we’ll get back to you.
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          {/* CATEGORY + PRIORITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category
              </label>
              <select
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                <option value="">Select category</option>
                <option>Billing</option>
                <option>Subscription</option>
                <option>Technical Issue</option>
                <option>Account</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows={4}
              required
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          {/* SUBMIT */}
          <div className="pt-2">
            <button
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
