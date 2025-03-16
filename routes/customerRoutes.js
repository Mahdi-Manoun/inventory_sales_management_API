import express from 'express';
import { addCustomer, editCustomerInfo } from '../controllers/customerController.js';
import validateContactInfo from '../middleware/validateContactInfo.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, validateContactInfo, addCustomer);

router.patch('/:customer_id', requireAuth, validateContactInfo, editCustomerInfo);

export default router;