import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '../services/apiProducts';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Loader2, Package } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { mutate: deleteProd } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('ပစ္စည်းဖျက်ပြီးပါပြီ');
    },
    onError: (err) => toast.error('ပစ္စည်းဖျက်မှုမအောင်မြင်ပါ'),
  });

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm('ဒီပစ္စည်းကိုဖျက်ဖို့သေချာပါသလား ?')) return;
    deleteProd(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading products</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ကုန်ပစ္စည်းများ</h1>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> ပစ္စည်းအသစ်ထည့်မည်
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} handleOpenModal={handleOpenModal} handleDelete={handleDelete} isProduct={true} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          <p>ကုန်ပစ္စည်းမရှိသေးပါ။ "ပစ္စည်းအသစ်ထည့်မည်" ကိုနှိပ်ပြီး ထည့်ပါ။</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'ကုန်ပစ္စည်း ပြင်ဆင်ရန်' : 'ကုန်ပစ္စည်းအသစ်'}>
        <ProductForm productToEdit={editingProduct} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
