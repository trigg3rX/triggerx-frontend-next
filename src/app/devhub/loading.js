import React from 'react';

export default function DevHubLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse bg-[#141414] rounded-2xl p-8">
        <div className="h-8 bg-gray-700 rounded w-60 mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#2A2A2A]">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-32 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-700 rounded-lg w-24"></div>
                  <div className="h-8 bg-gray-700 rounded-lg w-24"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
