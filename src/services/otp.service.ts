const otpStore = new Map<string, string>();

export const otpService = {
  async generateAndSend(pickupId: string, phone: string): Promise<string> {
    // Generate a simple 6-digit OTP for testing/demo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(pickupId, otp);
    
    // In a real application, you would integrate an SMS provider like Twilio here.
    console.log(`[OTP SERVICE] Generated OTP ${otp} for Pickup ${pickupId} (Phone: ${phone})`);
    
    return otp;
  },

  async verify(pickupId: string, otp: string): Promise<boolean> {
    const storedOtp = otpStore.get(pickupId);
    if (!storedOtp) {
      throw new Error('OTP expired or not requested');
    }
    if (storedOtp !== otp) {
      throw new Error('Invalid OTP. Please try again.');
    }
    otpStore.delete(pickupId);
    return true;
  }
};
