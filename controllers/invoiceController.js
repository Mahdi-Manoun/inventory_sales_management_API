import sequelize from '../config/db.js';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';


// create new invoice
const createInvoice = async (req, res) => {
    const { customer_id, products } = req.body;

    // Validate input data
    if (!customer_id || !products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const transaction = await sequelize.transaction(); // start transaction

    try {
        // calculate total amount of the invoice
        let totalAmount = 0;
        for (const product of products) {
            const productDetails = await Product.findByPk(product.id, { transaction });
            if (!productDetails) {
                await transaction.rollback();
                return res.status(404).json({ error: `Product with id ${product.id} not found` });
            }

            // debugging logs
            console.log('Product Price:', productDetails.price, 'Type:', typeof productDetails.price);
            console.log('Product Quantity:', product.quantity, 'Type:', typeof product.quantity);

            // convert price & quantity to float
            const price = parseFloat(productDetails.price);
            const quantity = parseFloat(product.quantity);

            // validate price & quantity
            if (isNaN(price)) {
                await transaction.rollback();
                return res.status(400).json({ error: `Invalid price for product with id ${product.id}` });
            }
            if (isNaN(quantity)) {
                await transaction.rollback();
                return res.status(400).json({ error: `Invalid quantity for product with id ${product.id}` });
            }

            // calculate total price
            const total_price = price * quantity;

            // validate total price
            if (isNaN(total_price) || total_price <= 0) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Invalid total price calculation' });
            }

            totalAmount += total_price;
        }

        // create invoice
        const invoice = await Invoice.create({
            customer_id,
            total_amount: totalAmount
        }, { transaction });

        // record sales and link them to the invoice
        for (const product of products) {
            const productDetails = await Product.findByPk(product.id, { transaction });
            const total_price = productDetails.price * product.quantity;

            await Sale.create({
                invoice_id: invoice.id,
                product_id: product.id,
                quantity: product.quantity,
                total_price: total_price
            }, { transaction });
        }

        await transaction.commit(); // commit transaction
        res.status(201).json(invoice);
    } catch (error) {
        await transaction.rollback(); // transaction rollback if there is an error
        res.status(500).json({ error: 'Error creating invoice', details: error.message });
    }
};


const editInvoice = async (req, res) => {
    const { invoice_id } = req.params;
    const { customer_id, products } = req.body;

    // validate input data
    if (!invoice_id || !customer_id || !products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const transaction = await sequelize.transaction(); // start transaction

    try {
        const invoice = await Invoice.findByPk(invoice_id, { transaction });
        if (!invoice) {
            await transaction.rollback();
            return res.status(404).json({ error: `Invoice with id ${invoice_id} not found` });
        }

        // calculate the new total amount
        let totalAmount = 0;
        for (const product of products) {
            const productDetails = await Product.findByPk(product.id, { transaction });
            if (!productDetails) {
                await transaction.rollback();
                return res.status(404).json({ error: `Product with id ${product.id} not found` });
            }

            // convert price and quantity to numbers
            const price = parseFloat(productDetails.price);
            const quantity = parseFloat(product.quantity);

            // validate price and quantity
            if (isNaN(price) || isNaN(quantity)) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Invalid price or quantity' });
            }

            // calculate total price
            const total_price = price * quantity;

            // validate total price
            if (isNaN(total_price) || total_price <= 0) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Invalid total price calculation' });
            }

            totalAmount += total_price;
        }

        // update the invoice
        await invoice.update(
            {
                customer_id,
                total_amount: totalAmount
            },
            { transaction }
        );

        // delete existing sales for this invoice
        await Sale.destroy({
            where: { invoice_id: invoice.id },
            transaction
        });

        // create new sales records
        for (const product of products) {
            const productDetails = await Product.findByPk(product.id, { transaction });
            const total_price = productDetails.price * product.quantity;

            await Sale.create(
                {
                    invoice_id: invoice.id,
                    product_id: product.id,
                    quantity: product.quantity,
                    total_price: total_price
                },
                { transaction }
            );
        }

        await transaction.commit(); // commit transaction
        res.status(200).json(invoice);
    } catch (error) {
        await transaction.rollback(); // transaction rollback if there is an error
        res.status(500).json({ error: 'Error updating invoice', details: error.message });
    }
};


const deleteInvoice = async (req, res) => {
    const { invoice_id } = req.params;

    // validate input data
    if (!invoice_id) {
        return res.status(400).json({ error: 'Invoice ID is required' });
    }

    const transaction = await sequelize.transaction(); // start transaction

    try {
        const invoice = await Invoice.findByPk(invoice_id, { transaction });
        if (!invoice) {
            await transaction.rollback();
            return res.status(404).json({ error: `Invoice with id ${invoice_id} not found` });
        }

        // delete associated sales records
        await Sale.destroy({
            where: { invoice_id: invoice.id },
            transaction
        });

        // delete the invoice
        await invoice.destroy({ transaction });

        await transaction.commit(); // commit transaction
        res.status(200).json({ message: `invoice with id ${invoice_id} deleted with it's sale` });
    } catch (error) {
        await transaction.rollback(); // transaction rollback if there is an error
        res.status(500).json({ error: 'Error deleting invoice', details: error.message });
    }
};


export {
    createInvoice,
    editInvoice,
    deleteInvoice
};