import React, { useEffect, useState } from "react";

/* -------- ULTRA COMPACT INPUT -------- */
const FormGroup = ({
  label,
  required,
  value = "",
  onChange,
  defaultValue,
  sub,
  type = "text",
}) => (
  <div className="space-y-[2px]">
    <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className="w-full h-8 rounded border border-slate-200
        px-2 text-[13px] text-slate-800
        focus:outline-none focus:border-slate-400
        transition"
    />

    {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
  </div>
);

const FormInput = ({ placeholder, type = "text" }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full h-8 rounded border border-slate-200
      px-2 text-[13px] text-slate-800
      focus:outline-none focus:border-slate-400
      transition"
  />
);

/* -------- MAIN -------- */
export function AccountDetailsForm() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="w-full px-4 py-10 flex justify-center">
      {/* CENTER COLUMN */}
      <div className="w-full max-w-md">
        {/* TITLE */}
        <div className="mb-4 text-center">
          <h1 className="text-sm font-semibold text-slate-900">
            Account settings
          </h1>
          <p className="text-[11px] text-slate-400">
            Manage your personal information
          </p>
        </div>

        {/* PAPER CARD */}
        <div
          className="
        bg-white
        border border-slate-200
        rounded-xl
        px-6 py-5
        shadow-[0_10px_30px_rgba(15,23,42,0.08)]
      "
        >
          <form className="space-y-5">
            {/* BASIC INFO */}
            <div className="space-y-3">
              <FormGroup
                label="Name"
                required
                value={user?.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />

              <FormGroup
                label="Email"
                required
                value={user?.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            {/* DIVIDER */}
            <div className="border-t border-slate-100" />

            {/* PASSWORD */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                Password
              </p>

              <div className="grid gap-2">
                <FormInput placeholder="Current password" type="password" />
                <FormInput placeholder="New password" type="password" />
                <FormInput placeholder="Confirm new password" type="password" />
              </div>

              <p className="text-[10px] text-slate-400">
                Leave blank to keep existing password
              </p>
            </div>

            {/* ACTION */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="h-8 px-4 rounded
              bg-slate-900 hover:bg-slate-800
              text-[13px] font-medium text-white
              transition"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
