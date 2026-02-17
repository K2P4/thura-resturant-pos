import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, UtensilsCrossed } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
          <div className="flex items-center gap-1.5 ml-1 text-primary">
            <UtensilsCrossed className="h-5 w-5 " />
            <span className="text-lg font-bold tracking-wide">သူရစားသောက်ဆိုင်</span>
          </div>

          <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)} className="hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-10 md:ml-64 lg:ml-56 transition-all duration-300">
          <div className="max-w-[1600px] mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
