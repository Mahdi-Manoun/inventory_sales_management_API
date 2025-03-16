import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';

const getCustomerAndSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const isCustomer = req.originalUrl.includes('customer');

        name = name?.trim();
        email = email?.trim();
        phone_number = phone_number?.trim();

        if (!Number.isInteger(Number(id)) || id <= 0) {
            return res.status(400).json({ error: 'Invalid workspace ID.' });
        }


        if (isCustomer) {
            const customer = await Customer.findByPk(id);
            req.customer = customer;
        } else {
            const supplier = await supplier.findByPk(id);
            req.supplier = supplier;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

