import { supabase } from './supabase';

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });

  if (error) {
    throw new Error('Categories could not be loaded');
  }

  return data;
}

export async function createCategory(name) {
  const { data, error } = await supabase.from('categories').insert([{ name }]).select();

  if (error) {
    throw new Error('Category could not be created');
  }

  return data;
}

export async function updateCategory({ id, name }) {
  const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select();

  if (error) {
    throw new Error('Category could not be updated');
  }

  return data;
}

export async function deleteCategory(id) {
  const { data, error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    throw new Error('Category could not be deleted');
  }

  return data;
}
