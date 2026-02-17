import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/apiCategories';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Pencil, Trash2, Loader2, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import CategoryForm from '../components/CategoryForm';

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('အမျိုးအစားသစ် ထည့်ပြီးပါပြီ');
      handleCloseModal();
    },
    onError: (err) => toast.error('အမျိုးအစားသစ် ထည့်မှု မအောင်မြင့်ပါ'),
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('အမျိုးအစား ပြင်ဆင်ပြီးပါပြီ');
      handleCloseModal();
    },
    onError: (err) => toast.error('အမျိုးအစား ပြင်ဆင်မှု မအောင်မြင့်ပါ'),
  });

  const { mutate: deleteCat } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('အမျိုးအစား ဖျက်ပြီးပါပြီ');
    },
    onError: (err) => toast.error('အမျိုးအစား ဖျက်မှု မအောင်မြင့်ပါ'),
  });

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = (name) => {
    if (editingCategory) {
      update({ id: editingCategory.id, name });
    } else {
      create(name);
    }
  };

  const handleDelete = (id) => {
    if (!confirm('ဒီအမျိုးအစားကိုဖျက်ဖို့သေချာပြီလား ?')) return;
    deleteCat(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">အမျိုးအစားများ</h1>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> အမျိုးအစားသစ်
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-bold w-[100px]">စဉ်</TableHead>
                <TableHead className="font-bold">အမည်</TableHead>
                <TableHead className="text-right font-bold">လုပ်ဆောင်ချက်</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-gray-500 font-medium font-sans">
                    အမျိုးအစား မရှိသေးပါ။
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
                    <TableCell className="font-bold text-gray-900">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="icon" onClick={() => handleOpenModal(category)} className="text-blue-600 hover:bg-blue-50 hover:shadow-sm rounded-full h-8 w-8 transition-all">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="icon" onClick={() => handleDelete(category.id)} className="text-red-600 hover:bg-red-50 hover:shadow-sm rounded-full h-8 w-8 transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategory ? 'အမျိုးအစား ပြင်ဆင်ရန်' : 'အမျိုးအစားသစ် ထည့်ရန်'}>
        <CategoryForm categoryToEdit={editingCategory} onClose={handleCloseModal} onSave={handleSave} isLoading={isCreating || isUpdating} />
      </Modal>
    </div>
  );
}
