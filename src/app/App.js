'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

import CreateJobPage from "./createjob/page";
import DashboardPage from "./dashboard/page";
import LeaderboardPage from "./leaderboard/page";
import DevhubPage from "./devhub/page";
import NotFound from "./notfound/page";
import ApiCreation from "./createapi/page";
import Devhub from "./devhub/page";

const App = () => {
  const pathname = usePathname();
  
  const renderContent = () => {
    if (pathname === '/') return <CreateJobPage />;
    if (pathname === '/dashboard') return <DashboardPage />;
    if (pathname === '/leaderboard') return <LeaderboardPage />;
    if (pathname === '/devhub') return <DevhubPage />;
    if (pathname.startsWith('/devhub/')) {
      const slug = pathname.replace('/devhub/', '');
      return <Devhub slug={slug} />;
    }
    if (pathname === '/api') return <ApiCreation />;
    console.log(pathname);
    
    return <NotFound />;
  };

  return renderContent();
};

export default dynamic(() => Promise.resolve(App), { ssr: false });
