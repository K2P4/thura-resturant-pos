import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createUser, updateUser } from '../services/apiUsers';

export default function UserForm({ userToEdit, onClose, onSuccess }) {
  const isEditing = Boolean(userToEdit?.id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'staff',
    password: '',
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        full_name: userToEdit.full_name || '',
        email: userToEdit.email || '',
        role: userToEdit.role || 'staff',
      });
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const { password, ...editPayload } = formData;
        await updateUser({id: userToEdit.id,...editPayload,});
        toast.success('အသုံးပြုသူအချက်အလက် ပြင်ဆင်ပြီးပါပြီ');
      } else {
        await createUser(formData);
        toast.success('အသုံးပြုသူအသစ် ထည့်သွင်းပြီးပါပြီ');
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">အမည်</label>
        <Input required placeholder="အမည်ထည့်ပါ" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">အီးမေးလ်</label>
        <Input required type="email" placeholder="အီးမေးလ်ထည့်ပါ" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">ရာထူး</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </div>
      {!isEditing && (
        <div className="space-y-2">
          <label className="text-sm font-medium">စကားဝှက်</label>
          <Input required type="password" placeholder="စကားဝှက်ထည့်ပါ" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          မလုပ်တော့ပါ
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditing ? 'ပြင်ဆင်မည်' : 'အသစ်ထည့်မည်'}
        </Button>
      </div>
    </form>
  );
}
