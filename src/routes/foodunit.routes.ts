import { Router } from 'express';
import { foodUnitController } from '../controllers/foodunit.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('food_unit'));

router.get('/profile', foodUnitController.getProfile);
router.get('/inventory', foodUnitController.getInventory);
router.post('/orders', foodUnitController.placeOrder);
router.get('/orders', foodUnitController.getMyOrders);
router.get('/orders/:id', foodUnitController.getOrderById);
router.get('/invoices', foodUnitController.getMyInvoices);
router.get('/invoices/:id', foodUnitController.getInvoiceById);

export default router;
