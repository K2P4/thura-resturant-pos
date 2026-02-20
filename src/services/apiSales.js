import { supabase } from './supabase';
import { insertSaleItems, upsertSaleItems } from './apiSaleItems';
import { setTableOccupied } from './apiTables';

export async function getPendingSaleByTable(tableId) {
  const { data, error } = await supabase.from('sales').select('*, sale_items(*, products(*))').eq('table_id', tableId).eq('status', 'pending').maybeSingle();

  if (error) throw new Error('Could not fetch pending sale');
  return data;
}

export async function createPendingSale({ tableId, items, totalAmount }) {
  const { data: sale, error } = await supabase
    .from('sales')
    .insert([
      {
        table_id: tableId,
        total_amount: totalAmount,
        status: 'pending',
        payment_method: 'cash',
      },
    ])
    .select()
    .single();

  if (error) throw new Error('Sale could not be created');

  await insertSaleItems(sale.id, items);
  await setTableOccupied(tableId, true);

  return { ...sale, items };
}

export async function updatePendingSale({ saleId, items, totalAmount }) {
  const { error } = await supabase.from('sales').update({ total_amount: totalAmount }).eq('id', saleId);

  if (error) throw new Error('Sale total could not be updated');

  await upsertSaleItems(saleId, items);
}

export async function completeSale({ saleId, tableId, totalAmount, paymentMethod = 'cash' }) {
  const { data: sale, error } = await supabase
    .from('sales')
    .update({
      status: 'completed',
      total_amount: totalAmount,
      payment_method: paymentMethod,
    })
    .eq('id', saleId)
    .select()
    .single();

  if (error) throw new Error('Sale could not be completed');

  await setTableOccupied(tableId, false);

  return sale;
}
