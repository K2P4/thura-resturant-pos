import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '../services/apiProducts';
import { createSale } from '../services/apiSales';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Search, ShoppingCart, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '@/components/ProductCard';
import InvoiceModal from '../components/InvoiceModal';
import { toast } from 'sonner';

export default function POS() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      setCompletedSale(data);
      setCart([]);
      setCheckoutModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('အရောင်းဘောင်ချာ ဖွင့်ပြီးပါပြီ');
    },
    onError: (err) => toast.error('ငွေရှင်းခြင်း မအောင်မြင်ပါ'),
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.categories?.name && p.categories.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [products, searchTerm]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const cartTotal = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleCheckout = () => {
    if (!user) {
      toast.error('ကျေးဇူးပြု၍ အရင်ဆုံး အကောင့်ဝင်ပါ');
      return;
    }

    checkout({
      items: cart,
      totalAmount: cartTotal,
      userId: user.id,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full lg:h-[calc(100vh-8rem)]">
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl overflow-auto shadow-sm min-h-[500px] lg:min-h-0 transition-all duration-300">
        <div className="p-4 border-b bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ရှာရန် (Search)..."
              className="pl-10 h-11 bg-white border-gray-200 focus:border-primary focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4  custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package size={48} className="mb-2 opacity-20" />
              <p>ရှာဖွေမှုမရှိပါ</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[350px] flex flex-col bg-white border border-gray-200 rounded-xl overflow-auto shadow-lg lg:h-full max-h-[70vh] lg:max-h-none transition-all duration-300">
        <div className="p-4 border-b bg-primary flex items-center justify-between shadow-sm">
          <h2 className="font-bold text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> ခြင်း
            <span className="text-xs font-normal opacity-80">({cart.length} မျိုး)</span>
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setCart([])} className="h-8 text-white hover:bg-white/20 px-2" disabled={cart.length === 0}>
            <Trash2 size={16} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
              <ShoppingCart size={64} className="mb-4 opacity-10" />
              <p className="text-sm font-medium">ခြင်းထဲတွင် ဘာမှမရှိသေးပါ</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">{item.name}</h4>
                  <span className="text-sm font-bold text-primary">{(item.price * item.quantity).toLocaleString()} ကျပ်</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className=" py-0.5 rounded-full ">{item.price.toLocaleString()} ကျပ်</span>
                  <div className="flex items-center gap-1.5">
                    <Button variant="icon" size="icon" onClick={() => updateQuantity(item.id, -1)} className=" hover:bg-white hover:shadow-sm rounded-lg border bg-white/50 transition-all">
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                    <Button variant="icon" size="icon" onClick={() => updateQuantity(item.id, 1)} className=" hover:bg-white hover:shadow-sm rounded-lg border bg-white/50 transition-all">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="icon" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 hover:border-red-100 rounded-lg bg-white/50 ml-1 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t bg-gray-50/50 space-y-4">
          <div className="space-y-1.5 border-b border-dashed pb-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>စုစုပေါင်း</span>
              <span>{subtotal.toLocaleString()} ကျပ်</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>အခွန် ( ၅% )</span>
              <span>{tax.toLocaleString()} ကျပ်</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">ကျသင့်ငွေ</span>
            <div className="text-right">
              <span className="text-xl font-bold text-primary">{cartTotal.toLocaleString()} ကျပ်</span>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full text-base font-bold h-12 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            disabled={cart.length === 0 || isCheckingOut}
            onClick={handleCheckout}
          >
            {isCheckingOut ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : 'ငွေရှင်းမည်'}
          </Button>
        </div>
      </div>

      <InvoiceModal isOpen={checkoutModalOpen} onClose={() => setCheckoutModalOpen(false)} sale={completedSale} />
    </div>
  );
}
