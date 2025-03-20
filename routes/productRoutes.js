import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
    addProduct,
    deleteProduct,
    editProduct,
    getAllProducts,
    getProduct
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', requireAuth, addProduct);

router.get('/', requireAuth, getAllProducts);

router.get('/filter', requireAuth, getProduct);

router.patch('/:id', requireAuth, editProduct);

router.delete('/:id', requireAuth, deleteProduct);

export default router;