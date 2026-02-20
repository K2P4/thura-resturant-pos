import { supabase } from './supabase';

export async function getTables() {
  const { data, error } = await supabase.from('tables').select('*').order('id', { ascending: true });

  if (error) throw new Error('Tables could not be loaded');
  return data;
}

export async function setTableOccupied(tableId, isOccupied) {
  const { data, error } = await supabase.from('tables').update({ is_occupied: isOccupied }).eq('id', tableId).select().single();

  if (error) throw new Error('Table status could not be updated');
  return data;
}
