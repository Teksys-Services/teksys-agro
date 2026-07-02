import { Router } from 'express';
import { farmerController } from '../controllers/farmer.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);


router.get('/profile', farmerController.getProfile);
router.get('/rates', farmerController.getRates);
router.post('/pickup', farmerController.createPickup);
router.get('/pickups', farmerController.getMyPickups);
router.get('/pickups/:id', farmerController.getPickupById);
router.get('/bills', farmerController.getMyBills);
router.get('/payments', farmerController.getPaymentHistory);

export default router;
