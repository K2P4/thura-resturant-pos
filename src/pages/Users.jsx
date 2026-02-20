import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getUsers, deleteUser } from '../services/apiUsers';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import UserForm from '../components/UserForm';

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { mutate: delUser } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('အသုံးပြုသူကို ဖျက်ပြီးပါပြီ');
    },
    onError: (err) => toast.error(err.message),
  });

  const handleOpenModal = (user = null) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleDelete = (id) => {
    if (!confirm('ဒီအသုံးပြုသူကို ဖျက်ဖို့ သေချာပြီလား ?')) return;
    delUser(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UsersIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">အသုံးပြုသူများ</h1>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> အသုံးပြုသူအသစ်
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-bold w-[100px]">စဉ်</TableHead>
                <TableHead className="font-bold">အမည်</TableHead>
                <TableHead className="font-bold">အီးမေးလ်</TableHead>
                <TableHead className="font-bold">ရာထူး</TableHead>
                <TableHead className="text-right font-bold">လုပ်ဆောင်ချက်</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-gray-500 font-medium font-sans">
                    အသုံးပြုသူ မရှိသေးပါ။
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
                    <TableCell className="font-bold text-gray-900">{user.full_name}</TableCell>
                    <TableCell className="text-gray-600 font-sans">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'warning'} className="font-medium">
                        {user.role === 'admin' ? 'Admin' : 'Staff'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="icon" onClick={() => handleOpenModal(user)} className="text-blue-600 hover:bg-blue-50 hover:shadow-sm rounded-full h-8 w-8 transition-all">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="icon" onClick={() => handleDelete(user.id)} className="text-red-600 hover:bg-red-50 hover:shadow-sm rounded-full h-8 w-8 transition-all">
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={userToEdit ? 'အသုံးပြုသူ အချက်အလက်ပြင်ရန်' : 'အသုံးပြုသူအသစ် ထည့်ရန်'}>
        <UserForm userToEdit={userToEdit} onClose={handleCloseModal} onSuccess={() => queryClient.invalidateQueries({ queryKey: ['users'] })} />
      </Modal>
    </div>
  );
}
