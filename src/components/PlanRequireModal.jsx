export default function PlanRequiredModal({ open, onLogout, onUpgrade }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.18)] overflow-hidden group">
        {/* Gradient Header */}
        <div className="relative px-10 pt-10 pb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* Floating Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

          {/* Icon */}
          <div className="relative mx-auto h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl text-blue-600 mb-4">
            🚀
          </div>

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200">
            Subscription Required
          </div>

          {/* Heading */}
          <h2 className="relative mt-4 text-3xl font-semibold text-gray-900 tracking-tight">
            Unlock your full workspace
          </h2>

          <p className="relative mt-3 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            Your access to advanced insights, campaign tools, and real-time
            analytics is currently limited. Upgrade your plan and get back to
            building faster.
          </p>
        </div>

        {/* Features */}
        <div className="px-10 py-8">
          <div className="grid grid-cols-2 gap-5 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✔</span>
              <span>Advanced analytics & reports</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✔</span>
              <span>Unlimited campaigns</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✔</span>
              <span>Team collaboration tools</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✔</span>
              <span>Priority email support</span>
            </div>
          </div>

          {/* Assurance */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>🔒 Your data stays safe</span>
            <span>⚡ Instant activation</span>
            <span>💳 Cancel anytime</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition"
          >
            Sign out
          </button>

          <button
            onClick={onUpgrade}
            className="group px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-medium text-white shadow-lg shadow-blue-600/30 transition-all duration-200"
          >
            Upgrade now
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
