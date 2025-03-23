import express from 'express';
import {
    createInvoice,
    deleteInvoice,
    editInvoice
} from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/', createInvoice);

router.put('/:invoice_id', editInvoice);

router.delete('/:invoice_id', deleteInvoice);

export default router;