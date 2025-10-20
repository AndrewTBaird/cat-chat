import { Outlet } from 'react-router-dom';
import { TopNav } from '@/components/top-nav';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
