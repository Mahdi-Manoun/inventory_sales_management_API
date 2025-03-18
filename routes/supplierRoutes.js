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
import validateUsername from '../middleware/validateUsername.js';

const router = express.Router();

router.post('/', requireAuth, validateUsername, validateContactInfo, createSupplier);

router.get('/', requireAuth, getSuppliers);

router.get('/:id', requireAuth, getSupplier);

router.patch('/:id', requireAuth, validateUsername, validateContactInfo, editSupplierInfo);

router.delete('/:id', requireAuth, deleteSupplier);

export default router;