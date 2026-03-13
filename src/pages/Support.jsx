import {
  MessageCircle,
  Mail,
  Phone,
  Send,
  LifeBuoy,
  Clock,
} from "lucide-react";

export default function Support() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Contact Support
        </h1>
        <p className="text-gray-600 mt-2">
          We're here to help you anytime. Choose your preferred way to reach us.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ========= LEFT INFO PANEL ========= */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <LifeBuoy className="text-blue-600" size={28} />
              <h2 className="text-xl font-semibold text-gray-800">
                Need Assistance?
              </h2>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Our support team helps you with traffic logs, analytics issues,
              integrations, and account management. Reach us using chat,
              email, phone, or Telegram.
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Average response time: <span className="font-medium text-gray-700">5–10 minutes</span>
          </div>
        </div>

        {/* ========= CONTACT OPTIONS ========= */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">

          {/* LIVE CHAT */}
          <button className="group bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md transition">
            <MessageCircle className="text-green-600 mb-3" size={28} />
            <h3 className="font-semibold text-gray-800">Live Chat</h3>
            <p className="text-sm text-gray-500 mt-1">
              Instant help from our support engineers.
            </p>

            <span className="mt-4 inline-block text-green-600 text-sm font-medium group-hover:underline">
              Start Chat →
            </span>
          </button>

          {/* EMAIL SUPPORT */}
          <button className="group bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md transition">
            <Mail className="text-blue-600 mb-3" size={28} />
            <h3 className="font-semibold text-gray-800">Email Support</h3>
            <p className="text-sm text-gray-500 mt-1">
              Send us detailed queries anytime.
            </p>

            <span className="mt-4 inline-block text-blue-600 text-sm font-medium group-hover:underline">
              Send Email →
            </span>
          </button>

          {/* PHONE SUPPORT */}
          <button className="group bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md transition">
            <Phone className="text-purple-600 mb-3" size={28} />
            <h3 className="font-semibold text-gray-800">Call Support</h3>
            <p className="text-sm text-gray-500 mt-1">
              Speak directly with our specialists.
            </p>

            <span className="mt-4 inline-block text-purple-600 text-sm font-medium group-hover:underline">
              Call Now →
            </span>
          </button>

          {/* TELEGRAM SUPPORT */}
          <button className="group bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md transition">
            <Send className="text-sky-500 mb-3" size={28} />
            <h3 className="font-semibold text-gray-800">Telegram Support</h3>
            <p className="text-sm text-gray-500 mt-1">
              Quick support via Telegram chat.
            </p>

            <span className="mt-4 inline-block text-sky-500 text-sm font-medium group-hover:underline">
              Open Telegram →
            </span>
          </button>

        </div>
      </div>

      {/* ================= 24/7 SUPPORT BANNER ================= */}
      <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-4">
          <Clock size={28} />
          <div>
            <h3 className="font-semibold text-lg">
              24/7 Support Available
            </h3>
            <p className="text-blue-100 text-sm">
              Our team monitors systems round-the-clock to assist you anytime.
            </p>
          </div>
        </div>

        <button className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition">
          Contact Support
        </button>
      </div>

    </div>
  );
}