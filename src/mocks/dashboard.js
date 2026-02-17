import { FileText, LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

export const dashboards = [
  {
    to: '/pos',
    Icon: ShoppingCart,
    title: 'အရောင်း',
    desc: 'အရောင်းဘောင်ချာဖွင့်ရန်',
    color: 'blue',
  },
  {
    to: '/products',
    Icon: Package,
    title: 'ကုန်ပစ္စည်းများ ',
    desc: 'ပစ္စည်းအသစ်ထည့်/ပြင်ရန်',
    color: 'emerald',
  },
  {
    to: '/categories',
    Icon: LayoutDashboard,
    title: 'အမျိုးအစားများ',
    desc: 'အမျိုးအစားအသစ်ထည့်/ပြင်ရန်',
    color: 'orange',
  },
  {
    to: '/users',
    Icon: Users,
    title: 'အသုံးပြုသူများ',
    desc: 'ဝန်ထမ်းများ စီမံရန်',
    color: 'yellow',
  },
  {
    to: '/reports',
    Icon: FileText,
    title: 'စာရင်းချုပ် ',
    desc: 'အရောင်းစာရင်းကြည့်ရန်',
    color: 'purple',
  },
];
