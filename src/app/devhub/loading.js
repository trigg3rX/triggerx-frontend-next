import React from 'react';

export default function DevHubLoading() {
  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem] w-[90%] mx-auto">
      <div className="w-full flex items-center justify-between mb-8">
        <div className="h-12 w-48 bg-[#222222] rounded-lg animate-pulse"></div>
        <div className="h-12 w-32 bg-[#222222] rounded-full animate-pulse"></div>
      </div>
      
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mb-40">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="rounded-2xl overflow-hidden shadow-sm bg-[#0F0F0F] p-3 border border-[#5F5F5F] flex flex-col justify-between">
              <div className="w-full h-[200px] rounded-lg bg-[#222222] animate-pulse"></div>
              <div className="flex flex-col ml-3">
                <div className="h-6 w-3/4 bg-[#222222] rounded mt-4 sm:mt-8 animate-pulse"></div>
                <div className="h-4 w-32 bg-[#222222] rounded mt-5 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
