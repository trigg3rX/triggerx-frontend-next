import React from 'react';
import DashboardSkeleton from '../../components/dashboard/DasboardSkeleton';

export default function DashboardLoading() {
  return (
      <div className="container mx-auto px-4 py-12">
        <DashboardSkeleton />
      </div>
  );
}
