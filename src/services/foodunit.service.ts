import { supabase } from '../config/supabase';

export const foodUnitService = {

  async getInventory(category?: string) {
    let query = supabase
      .from('warehouse_inventory')
      .select('*')
      .gt('quantity_kg', 0)
      .order('category');
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  async placeOrder(foodUnitId: string, items: any[]) {
    if (!items || items.length === 0) throw new Error('Order must have at least one item');

    let total_amount = 0;
    const validatedItems = [];

    for (const item of items) {
      const { data: inv } = await supabase
        .from('warehouse_inventory')
        .select('*')
        .eq('id', item.inventory_id)
        .single();

      if (!inv) throw new Error(`Item not found: ${item.inventory_id}`);
      if (inv.quantity_kg < item.quantity_kg) {
        throw new Error(`Insufficient stock for ${inv.item_name}. Available: ${inv.quantity_kg}kg`);
      }

      const subtotal = inv.rate_per_kg * item.quantity_kg;
      total_amount += subtotal;
      validatedItems.push({
        inventory_id: item.inventory_id,
        item_name: inv.item_name,
        category: inv.category,
        quantity_kg: item.quantity_kg,
        rate_per_kg: inv.rate_per_kg,
        subtotal,
      });
    }

    const { data: order, error: orderError } = await supabase
      .from('purchase_orders')
      .insert({ food_unit_id: foodUnitId, status: 'pending', total_amount })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    const itemsWithOrderId = validatedItems.map(i => ({ ...i, order_id: order.id }));
    const { error: itemsError } = await supabase
      .from('purchase_order_items')
      .insert(itemsWithOrderId);

    if (itemsError) throw new Error(itemsError.message);

    return order;
  },

  async getMyOrders(foodUnitId: string, status?: string) {
    let query = supabase
      .from('purchase_orders')
      .select('*, items:purchase_order_items(item_name, category, quantity_kg, rate_per_kg, subtotal)')
      .eq('food_unit_id', foodUnitId)
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getOrderById(orderId: string, foodUnitId: string) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*, items:purchase_order_items(item_name, category, quantity_kg, rate_per_kg, subtotal)')
      .eq('id', orderId)
      .eq('food_unit_id', foodUnitId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getMyInvoices(foodUnitId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('food_unit_id', foodUnitId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getInvoiceById(invoiceId: string, foodUnitId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, order:order_id(*, items:purchase_order_items(*))')
      .eq('id', invoiceId)
      .eq('food_unit_id', foodUnitId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getFoodUnitProfile(foodUnitId: string) {
    const { data, error } = await supabase
      .from('food_unit_profiles')
      .select('*')
      .eq('user_id', foodUnitId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};
