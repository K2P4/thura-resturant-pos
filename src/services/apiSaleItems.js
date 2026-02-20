import { supabase } from './supabase';

export async function upsertSaleItems(saleId, items) {
  for (const item of items) {
    const { data: existing, error } = await supabase.from('sale_items').select('id').eq('sale_id', saleId).eq('product_id', item.id).maybeSingle();

    if (error) throw new Error('Could not check existing sale items');

    if (existing) {
      const { error } = await supabase.from('sale_items').update({ quantity: item.quantity }).eq('id', existing.id);

      if (error) throw new Error('Sale item could not be updated');
    } else {
      const { error } = await supabase.from('sale_items').insert([
        {
          sale_id: saleId,
          product_id: item.id,
          quantity: item.quantity,
        },
      ]);

      if (error) throw new Error('Sale item could not be added');
    }
  }
}

export async function insertSaleItems(saleId, items) {
  const rows = items.map((item) => ({
    sale_id: saleId,
    product_id: item.id,
    quantity: item.quantity,
  }));

  const { error } = await supabase.from('sale_items').insert(rows);
  if (error) throw new Error('Sale items could not be created');
}

export async function deleteSaleItem(saleItemId) {
  const { error } = await supabase.from('sale_items').delete().eq('id', saleItemId);

  if (error) throw new Error('Sale item could not be removed');
}
