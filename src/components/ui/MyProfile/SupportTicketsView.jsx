import React, { useState } from "react";

export function SupportTicketsView() {
  const [tickets] = useState([
    {
      id: "TCK-5231",
      subject: "Payment not reflecting",
      status: "Open",
      priority: "High",
      createdAt: "Nov 18, 2025",
    },
    {
      id: "TCK-5122",
      subject: "Issue with subscription invoice",
      status: "In Progress",
      priority: "Medium",
      createdAt: "Nov 16, 2025",
    },
    {
      id: "TCK-5018",
      subject: "Unable to update profile",
      status: "Closed",
      priority: "Low",
      createdAt: "Nov 12, 2025",
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-6">
      {/* MAIN CARD */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Support Tickets
            </h1>
            <p className="text-sm text-slate-500">Manage customer issues</p>
          </div>

          <button className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-800 transition">
            + Create Ticket
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left">Ticket</th>
                <th className="text-left">Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filtered.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="p-3 font-medium text-slate-700">
                      {ticket.id}
                    </td>
                    <td className="text-slate-600">{ticket.subject}</td>

                    <td>
                      <span
                        className={
                          "px-2 py-1 rounded-full text-xs font-medium " +
                          (ticket.status === "Open"
                            ? "bg-green-100 text-green-600"
                            : ticket.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600")
                        }
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          "px-2 py-1 rounded-full text-xs font-medium " +
                          (ticket.priority === "High"
                            ? "bg-red-100 text-red-600"
                            : ticket.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-600")
                        }
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="text-slate-500">{ticket.createdAt}</td>

                    <td>
                      <button className="text-orange-500 hover:underline font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER STATS */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: tickets.length },
            {
              label: "Open",
              value: tickets.filter((t) => t.status === "Open").length,
            },
            {
              label: "Closed",
              value: tickets.filter((t) => t.status === "Closed").length,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="border rounded-xl p-4 text-center bg-slate-50"
            >
              <p className="text-xs text-slate-500">{item.label}</p>
              <h2 className="text-xl font-semibold text-slate-800">
                {item.value}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
