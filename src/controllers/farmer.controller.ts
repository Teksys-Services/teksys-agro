import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

const svc = () => require('../services/farmer.service').farmerService;

export const farmerController = {
  async getRates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getRates(req.query.area as string);
      sendSuccess(res, data, 'Rates fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async createPickup(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().createPickup(req.user!.userId, req.body);
      sendSuccess(res, data, 'Pickup request created', 201);
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getMyPickups(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getMyPickups(req.user!.userId, req.query.status as string);
      sendSuccess(res, data, 'Pickups fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getPickupById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getPickupById(req.params.id, req.user!.userId);
      sendSuccess(res, data, 'Pickup fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getMyBills(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getMyBills(req.user!.userId);
      sendSuccess(res, data, 'Bills fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getPaymentHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getPaymentHistory(req.user!.userId);
      sendSuccess(res, data, 'Payment history fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await svc().getProfile(req.user!.userId);
      sendSuccess(res, data, 'Profile fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
};
