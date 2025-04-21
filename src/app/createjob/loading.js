import React from 'react';

export default function CreateJobLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse bg-[#141414] rounded-2xl p-8">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-700 rounded w-60 mb-8"></div>

        {/* Form sections */}
        <div className="space-y-10">
          {/* Contract Details Section */}
          <div>
            <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Function Arguments Section */}
          <div>
            <div className="h-6 bg-gray-700 rounded w-52 mb-4"></div>
            <div className="h-40 bg-gray-700 rounded mb-4"></div>
          </div>

          {/* Timeframe Inputs Section */}
          <div>
            <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Fee Section */}
          <div>
            <div className="h-6 bg-gray-700 rounded w-36 mb-4"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <div className="h-10 bg-gray-700 rounded-lg w-28"></div>
            <div className="h-10 bg-gray-700 rounded-lg w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
