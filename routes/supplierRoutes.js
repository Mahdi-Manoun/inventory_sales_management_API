import express from 'express';
import { 
    createSupplier,
    getSuppliers,
    getSupplier,
    editSupplierInfo,
    deleteSupplier
} from '../controllers/supplierController.js';

// middleware
import requireAuth from '../middleware/requireAuth.js';
import validateContactInfo from '../middleware/validateContactInfo.js';

const router = express.Router();

router.post('/', requireAuth, validateContactInfo, createSupplier);

router.get('/', requireAuth, getSuppliers);

router.get('/:supplier_id', requireAuth, getSupplier);

router.patch('/:supplier_id', requireAuth, validateContactInfo, editSupplierInfo);

router.delete('/:supplier_id', requireAuth, deleteSupplier);

export default router;