import { Request, Response } from 'express';
import { billService } from '../services/bill.service';

export const billController = {
  async createBill(req: Request, res: Response) {
    try {
      const { farmer_id, amount, notes } = req.body;
      if (!farmer_id || !amount) {
        return res.status(400).json({ success: false, message: 'farmer_id and amount are required' });
      }
      const bill = await billService.createBill({ farmer_id, amount, notes });
      res.json({ success: true, message: 'Bill created', data: bill });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getBills(req: Request, res: Response) {
    try {
      const farmer_id = req.query.farmer_id as string | undefined;
      const bills = await billService.getBills(farmer_id);
      res.json({ success: true, data: bills });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { bill_id, status, reference } = req.body;
      if (!bill_id || !status) {
        return res.status(400).json({ success: false, message: 'bill_id and status are required' });
      }
      if (!['pending', 'paid'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status must be pending or paid' });
      }
      const bill = await billService.updatePaymentStatus(bill_id, status, reference);
      res.json({ success: true, message: `Bill marked as ${status}`, data: bill });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getBillById(req: Request, res: Response) {
    try {
      const bill = await billService.getBillById(req.params.id);
      res.json({ success: true, data: bill });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
