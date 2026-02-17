import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function CategoryForm({ categoryToEdit, onClose, onSave, isLoading }) {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setCategoryName(categoryToEdit.name);
    } else {
      setCategoryName('');
    }
  }, [categoryToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    onSave(categoryName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">အမျိုးအစား အမည်</label>
        <Input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="ဥပမာ - အစားအစာ" disabled={isLoading} />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          မလုပ်တော့ပါ
        </Button>
        <Button type="submit" isLoading={isLoading} variant="primary">
          သိမ်းဆည်းမည်
        </Button>
      </div>
    </form>
  );
}
