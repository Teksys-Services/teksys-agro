import { supabase } from '../config/supabase';
import { otpService } from './otp.service';


export const agentService = {
  async getAssignedPickups(agentId: string) {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*, farmer:farmer_id(id, name, phone), assignment:delivery_assignments(*)')
      .eq('assigned_agent_id', agentId)
      .not('status', 'eq', 'cancelled')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getPickupById(pickupId: string, agentId: string) {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*, farmer:farmer_id(id, name, phone), status_logs(*)')
      .eq('id', pickupId).eq('assigned_agent_id', agentId).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async acceptPickup(pickupId: string, agentId: string) {
    const { data: pickup } = await supabase
      .from('pickup_requests').select('status, farmer_id')
      .eq('id', pickupId).eq('assigned_agent_id', agentId).single();
    if (!pickup) throw new Error('Pickup not found');
    if (pickup.status !== 'assigned') throw new Error('Pickup already accepted or not assigned');

    const { data: farmer } = await supabase
      .from('users').select('phone').eq('id', pickup.farmer_id).single();
    if (!farmer) throw new Error('Farmer not found');

    const generatedOtp = await otpService.generateAndSend(pickupId, farmer.phone);
    console.log(`[TEST MODE] OTP for agent to show farmer: ${generatedOtp}`);

    await supabase.from('pickup_requests')
      .update({ status: 'otp_generated' }).eq('id', pickupId);
    await supabase.from('delivery_assignments')
      .update({ accepted_at: new Date().toISOString(), status: 'accepted' })
      .eq('pickup_id', pickupId).eq('agent_id', agentId);
    await supabase.from('status_logs').insert({
      pickup_id: pickupId, old_status: 'assigned', new_status: 'otp_generated',
      changed_by: agentId, notes: 'Agent accepted pickup, OTP sent to farmer',
    });
    return { message: 'OTP sent to farmer. Ask farmer for OTP to confirm pickup.', test_otp: generatedOtp };
  },

  async verifyOTPAndConfirmPickup(pickupId: string, agentId: string, otp: string) {
    const { data: pickup } = await supabase
      .from('pickup_requests').select('status')
      .eq('id', pickupId).eq('assigned_agent_id', agentId).single();
    if (!pickup) throw new Error('Pickup not found');
    if (pickup.status !== 'otp_generated') throw new Error('OTP not generated for this pickup');

    await otpService.verify(pickupId, otp);

    await supabase.from('pickup_requests')
      .update({ status: 'picked_up' }).eq('id', pickupId);
    await supabase.from('delivery_assignments')
      .update({ completed_at: new Date().toISOString(), status: 'completed' })
      .eq('pickup_id', pickupId).eq('agent_id', agentId);
    await supabase.from('status_logs').insert({
      pickup_id: pickupId, old_status: 'otp_generated', new_status: 'picked_up',
      changed_by: agentId, notes: 'OTP verified, pickup confirmed',
    });
    return { message: 'Pickup confirmed successfully' };
  },

  async getProfile(agentId: string) {
    const { data: user } = await supabase.from('users').select('*').eq('id', agentId).single();
    const { data: profile } = await supabase.from('agent_profiles').select('*').eq('user_id', agentId).single();
    return { ...user, profile };
  },
};
