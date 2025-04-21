import React from 'react';
import LeaderboardSkeleton from '../../components/leaderboard/LeaderboardSkeleton';

export default function LeaderboardLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <LeaderboardSkeleton />
    </div>
  );
} 