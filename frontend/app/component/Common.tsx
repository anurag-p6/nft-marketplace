import React from "react";
import Link from "next/link";

type CommonProps = {
  isCollapsed: boolean;
};

export default function Common({ isCollapsed }: CommonProps) {
  return (
    <div>
      <div className={`flex-1 p-4 ${isCollapsed ? "lg:px-3" : ""}`}>
        {/* Logo Section */}
        <div
          className={`flex items-center gap-3 mb-8 pt-2 ${
            isCollapsed ? "lg:justify-center" : ""
          }`}
        >
          <Link
            href="/"
            className={`flex items-center gap-3 group shrink-0 ${
              isCollapsed ? "lg:justify-center" : ""
            }`}
          >
            {/* Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31-1.19-6-4.98-6-9V8.3l6-3.3 6 3.3V11c0 4.02-2.69 7.81-6 9z" />
              </svg>
            </div>

            {/* Logo Text - Only show when not collapsed */}
            {!isCollapsed && (
              <div>
                <span className="text-lg font-bold text-gray-900 block">
                  NFT Market
                </span>
                <span className="text-xs text-gray-500 block">
                  Digital Marketplace
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}