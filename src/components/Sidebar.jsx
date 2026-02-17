import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, LayoutDashboard, Package, ShoppingCart, Users, LogOut, UtensilsCrossed, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from './ui/Button';

const navItems = [
  {
    to: '/pos',
    icon: ShoppingCart,
    label: 'အရောင်း (POS)',
  },
  {
    to: '/products',
    icon: Package,
    label: 'ကုန်ပစ္စည်းများ',
  },
  {
    to: '/categories',
    icon: LayoutDashboard,
    label: 'အမျိုးအစားများ',
  },
  {
    to: '/users',
    icon: Users,
    label: 'အသုံးပြုသူများ',
  },
  {
    to: '/reports',
    icon: FileText,
    label: 'စာရင်းချုပ်',
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { signOut, user } = useAuth();

  const handleLogout = () => {
    signOut();
    toast.info('အကောင့်ထွက်လိုက်ပါပြီ');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden transition-opacity duration-300" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <div className="pb-4 flex items-center justify-between px-2 border-b">
            <div className="flex items-center gap-1">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-primary">သူရစားသောက်ဆိုင်</span>
            </div>
            <Button variant="icon" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-gray-600'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-auto border-t border-gray-200 pt-6">
            <div className="mb-4 px-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans">အသုံးပြုသူ</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
            </div>

            <Button size="sm" variant="destructive" onClick={handleLogout} className="w-full justify-start gap-3">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">အကောင့်ထွက်မည်</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
