import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/apiProducts';
import { getPendingSaleByTable, createPendingSale, updatePendingSale, completeSale } from '../services/apiSales';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Loader2, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CartPanel from '../components/CartPanel';
import InvoiceModal from '../components/InvoiceModal';
import { toast } from 'sonner';
import { useState } from 'react';

export default function POS() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const numericTableId = Number(tableId);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [completedSaleData, setCompletedSaleData] = useState(null);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: pendingSale, isLoading: pendingLoading } = useQuery({
    queryKey: ['pendingSale', numericTableId],
    queryFn: () => getPendingSaleByTable(numericTableId),
    enabled: !!numericTableId,
  });

  const { cart, pendingSaleId, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, tax, total } = useCart(pendingSale, numericTableId);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['pendingSale', numericTableId] });
    queryClient.invalidateQueries({ queryKey: ['tables'] });
  };

  const { mutate: saveSale, isPending: isSaving } = useMutation({
    mutationFn: () => (pendingSaleId ? updatePendingSale({ saleId: pendingSaleId, items: cart, totalAmount: total }) : createPendingSale({ tableId: numericTableId, items: cart, totalAmount: total })),
    onSuccess: () => {
      invalidateAll();
      toast.success('အော်ဒါ သိမ်းပြီးပါပြီ');
      navigate('/tables');
    },
    onError: () => toast.error('အော်ဒါ သိမ်းခြင်း မအောင်မြင်ပါ'),
  });

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: async () => {
      let saleId = pendingSaleId;
      if (!saleId) {
        const created = await createPendingSale({
          tableId: numericTableId,
          items: cart,
          totalAmount: total,
        });
        saleId = created.id;
      } else {
        await updatePendingSale({ saleId, items: cart, totalAmount: total });
      }
      return completeSale({ saleId, tableId: numericTableId, totalAmount: total });
    },
    onSuccess: (data) => {
      setCompletedSaleData({ ...data, items: cart });
      setCheckoutModalOpen(true);
      clearCart();
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('ငွေရှင်းခြင်း အောင်မြင်ပါသည်');
    },
    onError: () => toast.error('ငွေရှင်းခြင်း မအောင်မြင်ပါ'),
  });

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(term) || p.categories?.name?.toLowerCase().includes(term));
  }, [products, searchTerm]);

  const handleSave = () => {
    if (cart.length === 0) return toast.error('ခြင်းထဲတွင် ပစ္စည်းထည့်ပါ');
    saveSale();
  };

  const handleCheckout = () => {
    if (!user) return toast.error('ကျေးဇူးပြု၍ အရင်ဆုံး အကောင့်ဝင်ပါ');
    if (cart.length === 0) return toast.error('ခြင်းထဲတွင် ပစ္စည်းထည့်ပါ');
    checkout();
  };

  const handleInvoiceClose = () => {
    setCheckoutModalOpen(false);
    navigate('/tables');
  };

  if (productsLoading || pendingLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full lg:h-[calc(100vh-8rem)]">
      {/* Products */}
      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl overflow-auto shadow-sm min-h-[500px] lg:min-h-0 transition-all duration-300">
        <div className="p-4 border-b bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => navigate('/tables')} className="shrink-0 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ရှာရန် (Search)..."
                className="pl-10 h-11 bg-white border-gray-200 focus:border-primary focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20">
              <span className="text-sm font-bold">စားပွဲ - {numericTableId}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Search size={48} className="mb-2 opacity-20" />
              <p>ရှာဖွေမှုမရှိပါ</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <CartPanel
        cart={cart}
        pendingSaleId={pendingSaleId}
        subtotal={subtotal}
        tax={tax}
        total={total}
        isSaving={isSaving}
        isCheckingOut={isCheckingOut}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        onSave={handleSave}
        onCheckout={handleCheckout}
      />

      <InvoiceModal isOpen={checkoutModalOpen} onClose={handleInvoiceClose} sale={completedSaleData} />
    </div>
  );
}
