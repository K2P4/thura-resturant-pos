import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createProduct, updateProduct } from '../services/apiProducts';
import { getCategories } from '../services/apiCategories';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from 'sonner';

export default function ProductForm({ productToEdit = {}, onClose }) {
  const isEditSession = Boolean(productToEdit?.id);
  const { id: editId, ...editValues } = productToEdit || {};

  const [name, setName] = useState(editValues.name || '');
  const [price, setPrice] = useState(editValues.price || '');
  const [categoryId, setCategoryId] = useState(editValues.category_id || '');
  const [imageUrl, setImageUrl] = useState(editValues.image_url || '');

  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('ပစ္စည်းအသစ် ထည့်သွင်းပြီးပါပြီ');
      onClose();
    },
    onError: (err) => toast.error('အမှားဖြစ်ပေါ်ပါသည်', { description: err.message }),
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (data) => updateProduct({ id: editId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('ပစ္စည်းပြင်ဆင်မှု အောင်မြင်ပါသည်');
      onClose();
    },
    onError: (err) => toast.error('အမှားဖြစ်ပေါ်ပါသည်', { description: err.message }),
  });

  const isWorking = isCreating || isUpdating;

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name,
      price: parseFloat(price),
      category_id: categoryId ? parseInt(categoryId) : null,
      image_url: imageUrl,
    };

    if (isEditSession) {
      update(data);
    } else {
      create(data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">အမည်</label>
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="ဥပမာ - ကြက်ဆီထမင်း" disabled={isWorking} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">ဈေးနှုန်း</label>
        <Input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" disabled={isWorking} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">အမျိုးအစား</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isWorking}
        >
          <option value="">အမျိုးအစား ရွေးချယ်ပါ</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">ဓာတ်ပုံ လင့်ခ်</label>
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" disabled={isWorking} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isWorking}>
          မလုပ်တော့ပါ
        </Button>
        <Button type="submit" isLoading={isWorking}>
          သိမ်းဆည်းမည်
        </Button>
      </div>
    </form>
  );
}
