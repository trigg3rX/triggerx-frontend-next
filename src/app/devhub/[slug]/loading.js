import React from 'react';

export default function DevHubItemLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse bg-[#141414] rounded-2xl p-8">
        <div className="h-10 bg-gray-700 rounded w-3/4 max-w-lg mb-6"></div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
          <div>
            <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-48"></div>
          </div>
        </div>

        <div className="mb-10">
          <div className="h-5 bg-gray-700 rounded w-full mb-3"></div>
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-5 bg-gray-700 rounded w-5/6 mb-3"></div>
          <div className="h-5 bg-gray-700 rounded w-1/2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1A1A] rounded-lg p-5 border border-[#2A2A2A]">
            <div className="h-5 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-5 border border-[#2A2A2A]">
            <div className="h-5 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-5 border border-[#2A2A2A]">
            <div className="h-5 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <div className="h-10 bg-gray-700 rounded-lg w-28"></div>
          <div className="h-10 bg-gray-700 rounded-lg w-28"></div>
        </div>
      </div>
    </div>
  );
}
