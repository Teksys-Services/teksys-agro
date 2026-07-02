import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

const getFoodUnitService = () => require('../services/foodunit.service').foodUnitService;

export const foodUnitController = {
  async getInventory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const data = await getFoodUnitService().getInventory(category);
      sendSuccess(res, data, 'Inventory fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async placeOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await getFoodUnitService().placeOrder(req.user!.userId, req.body.items);
      sendSuccess(res, data, 'Order placed successfully', 201);
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getMyOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const data = await getFoodUnitService().getMyOrders(req.user!.userId, status);
      sendSuccess(res, data, 'Orders fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getOrderById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await getFoodUnitService().getOrderById(req.params.id, req.user!.userId);
      sendSuccess(res, data, 'Order fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getMyInvoices(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await getFoodUnitService().getMyInvoices(req.user!.userId);
      sendSuccess(res, data, 'Invoices fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getInvoiceById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await getFoodUnitService().getInvoiceById(req.params.id, req.user!.userId);
      sendSuccess(res, data, 'Invoice fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await getFoodUnitService().getFoodUnitProfile(req.user!.userId);
      sendSuccess(res, data, 'Profile fetched');
    } catch (err: any) { sendError(res, err.message, 400); }
  },
};
