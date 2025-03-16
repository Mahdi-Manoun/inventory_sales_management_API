import express from 'express';
import {
    addCustomer,
    deleteCustomer,
    editCustomerInfo,
    getCustomer,
    getCustomers
} from '../controllers/customerController.js';

//middleware
import validateContactInfo from '../middleware/validateContactInfo.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, validateContactInfo, addCustomer);

router.get('/', requireAuth, getCustomers);

router.get('/:customer_id', requireAuth, getCustomer);

router.patch('/:customer_id', requireAuth, validateContactInfo, editCustomerInfo);

router.delete('/:customer_id', requireAuth, deleteCustomer);

export default router;