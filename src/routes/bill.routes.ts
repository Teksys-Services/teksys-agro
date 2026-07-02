import { Router } from 'express';
import { billController } from '../controllers/bill.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/create', authenticate, billController.createBill);
router.get('/all', authenticate, billController.getBills);
router.put('/update-status', authenticate, billController.updatePaymentStatus);
router.get('/:id', authenticate, billController.getBillById);
export default router;
