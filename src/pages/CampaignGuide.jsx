import { Rocket, Settings, Upload, CheckCircle, Code } from "lucide-react";

export default function CampaignGuide() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Campaign Quick Start
        </h1>
        <p className="text-gray-600 mt-2">
          Follow these steps to create, configure, and launch your campaign.
        </p>
      </div>

      {/* TIMELINE */}
      <div className="flex items-center justify-between mb-10">

        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white p-3 rounded-xl">
            <Rocket size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Create Campaign</p>
            <p className="text-sm text-gray-500">Choose integration type</p>
          </div>
        </div>

        <div className="h-[2px] bg-gray-300 flex-1 mx-4"></div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <Settings size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Configure Filters</p>
            <p className="text-sm text-gray-500">Geo targeting & security</p>
          </div>
        </div>

        <div className="h-[2px] bg-gray-300 flex-1 mx-4"></div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-3 rounded-xl">
            <Upload size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Deploy</p>
            <p className="text-sm text-gray-500">Launch campaign</p>
          </div>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDEBAR GUIDE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

          <h3 className="font-semibold text-gray-800 mb-4">
            Guide Sections
          </h3>

          <div className="space-y-3">

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-sm text-gray-700">
                Create Campaign
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
              <CheckCircle size={18} className="text-blue-600" />
              <span className="text-sm text-gray-700">
                Configure Filters
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
              <CheckCircle size={18} className="text-purple-600" />
              <span className="text-sm text-gray-700">
                Deploy & Launch
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          {/* TITLE */}
          <div className="flex items-center gap-3 mb-4">
            <Code className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              JavaScript Integration
            </h2>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed mb-6">
            JavaScript integration is the simplest method. It works on any
            website with HTML access. The script runs client-side when
            visitors land on your page and redirects qualified traffic
            based on your filters.
          </p>

          {/* BEST FOR */}
          <h3 className="font-semibold text-gray-800 mb-3">
            Best For
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
              Static HTML websites
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
              WordPress / Shopify / Wix
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
              Landing page builders
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
              Quick setup (under 5 minutes)
            </div>

          </div>

          {/* VIDEO */}
          <h3 className="font-semibold text-gray-800 mb-3">
            Video Tutorial
          </h3>

          <div className="bg-black rounded-xl h-[300px] flex items-center justify-center text-white">
            Video Player
          </div>

        </div>

      </div>

    </div>
  );
}