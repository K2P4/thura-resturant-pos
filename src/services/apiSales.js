import { supabase } from './supabase';

export async function createSale({ items, totalAmount, userId, paymentMethod = 'cash' }) {
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert([
      {
        total_amount: totalAmount,
        user_id: userId,
        payment_method: paymentMethod,
      },
    ])
    .select()
    .single();

  if (saleError) {
    throw new Error('Sale could not be created');
  }

  const saleItems = items.map((item) => ({
    sale_id: saleData.id,
    product_id: item.id,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from('sale_items').insert(saleItems);

  if (itemsError) {
    throw new Error('Sale items could not be created');
  }

  return { ...saleData, items: items };
}
