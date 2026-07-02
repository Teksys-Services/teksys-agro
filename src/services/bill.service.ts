import { supabase } from '../config/supabase';

export const billService = {
  async createBill(dto: { farmer_id: string; amount: number; notes?: string }) {
    const bill_number = `BILL-${Date.now()}`;
    const { data, error } = await supabase
      .from('bills')
      .insert({
        farmer_id: dto.farmer_id,
        bill_number,
        amount: dto.amount,
        status: 'pending',
        notes: dto.notes || null,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        total_amount: dto.amount,
        total_weight_kg: 0,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getBills(farmer_id?: string) {
    let query = supabase
      .from('bills')
      .select('*, farmer:farmer_id(id, name, phone, email)')
      .order('generated_at', { ascending: false });
    if (farmer_id) query = query.eq('farmer_id', farmer_id);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  async updatePaymentStatus(bill_id: string, status: 'pending' | 'paid', reference?: string) {
    const update: any = { status };
    if (status === 'paid') update.paid_at = new Date().toISOString();
    if (reference) update.payout_reference_id = reference;
    const { data, error } = await supabase
      .from('bills')
      .update(update)
      .eq('id', bill_id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getBillById(bill_id: string) {
    const { data, error } = await supabase
      .from('bills')
      .select('*, farmer:farmer_id(id, name, phone)')
      .eq('id', bill_id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};
