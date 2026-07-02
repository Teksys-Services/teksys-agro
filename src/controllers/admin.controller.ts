import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

const svc = () => require('../services/admin.service').adminService;

export const adminController = {
  async setRate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().setRate(req.body, req.user!.userId);
      sendSuccess(res, data, 'Rate set successfully', 201);
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getRates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getRates();
      sendSuccess(res, data, 'Rates fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getAllPickups(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getAllPickups(req.query.status as string);
      sendSuccess(res, data, 'Pickups fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getEligibleAgents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getEligibleAgents(Number(req.query.weight));
      sendSuccess(res, data, 'Eligible agents fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async assignAgent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().assignAgent(req.params.pickupId, req.body.agent_id, req.user!.userId);
      sendSuccess(res, data, 'Agent assigned');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async approvePickup(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().approvePickup(req.params.pickupId, req.user!.userId);
      sendSuccess(res, data, 'Pickup approved');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async generateBill(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { farmer_id, month, year } = req.body;
      const data = await svc().generateBill(farmer_id, month, year, req.user!.userId);
      sendSuccess(res, data, 'Bill generated', 201);
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async markPaymentPaid(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().markPaymentPaid(req.params.paymentId, req.body, req.user!.userId);
      sendSuccess(res, data, 'Payment marked as paid');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getAllFarmers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getAllFarmers();
      sendSuccess(res, data, 'Farmers fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getAllAgents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getAllAgents();
      sendSuccess(res, data, 'Agents fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getSummary();
      sendSuccess(res, data, 'Summary fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getPendingPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getPendingPayments();
      sendSuccess(res, data, 'Pending payments fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
};
