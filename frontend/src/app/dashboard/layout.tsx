import { Outlet } from 'react-router-dom';
import { TopNav } from '@/components/top-nav';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <Outlet />
    </div>
  );
}
