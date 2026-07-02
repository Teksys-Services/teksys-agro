import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const authController = {
  async registerFarmer(req: Request, res: Response): Promise<void> {
    try {
      const data = await authService.registerFarmer(req.body);
      sendSuccess(res, data, 'Farmer registered successfully', 201);
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async registerAgent(req: Request, res: Response): Promise<void> {
    try {
      const data = await authService.registerAgent(req.body);
      sendSuccess(res, data, 'Agent registered successfully', 201);
    } catch (err: any) { sendError(res, err.message, 400); }
  },
  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = await authService.login(req.body);
      sendSuccess(res, data, 'Login successful');
    } catch (err: any) { sendError(res, err.message, 401); }
  },
};
