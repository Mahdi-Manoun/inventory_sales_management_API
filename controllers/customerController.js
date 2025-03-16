import Customer from '../models/Customer.js';

// add a customer
const addCustomer = async (req, res) => {
    let { customer_name, email, phone_number } = req.body;

    try {
        customer_name = customer_name?.trim();
        email = email?.trim();
        phone_number = phone_number?.trim();

        const emptyFields = [];
        if (!customer_name) emptyFields.push('customer_name');

        if (!email) emptyFields.push('email');

        if (!phone_number) emptyFields.push('phone_number');

        if (emptyFields.length > 0) {
            return res.status(400).json({ error: `The following fields are required: "${emptyFields.join(', ')}".` });
        }

        const customer = await Customer.create({ name: customer_name, email, phone: phone_number });

        return res.status(201).json({
            message: `${customer_name} added successfully!`,
            customer
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// get all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();

        if (customers.length === 0) {
            return res.status(404).json({ message: 'No customers found.' });
        }

        return res.status(200).json({ data: customers });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// get a single customer
const getCustomer = async (req, res) => {
    const { customer_id } = req.params;

    try {
        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${customer_id} was not found.`
            });
        }

        return res.status(200).json(customer);

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// edit customer's info
const editCustomerInfo = async (req, res) => {
    const { customer_id } = req.params;
    let { customer_name, email, phone_number } = req.body;

    try {
        customer_name = customer_name?.trim();
        email = email?.trim();
        phone_number = phone_number?.trim();

        if (!Number.isInteger(Number(customer_id)) || customer_id <= 0) {
            return res.status(400).json({ error: 'Invalid workspace ID.' });
        }

        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${customer_id} was not found.`
            });
        }

        customer.name = customer_name || customer.name;
        customer.email = email || customer.email;
        customer.phone = phone_number || customer.phone;

        await customer.save();

        return res.status(200).json({
            message: `Customer with ID ${customer_id} updated successfully!`,
            customer
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// delete a customer
const deleteCustomer = async (req, res) => {
    const { customer_id } = req.params;

    try {
        const existingCustomer = await Customer.findByPk(customer_id);

        if (!existingCustomer) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${customer_id} was not found.`
            });
        }

        await existingCustomer.destroy();

        return res.status(200).json({ message: `Customer with ID ${customer_id} has been deleted successfully!` });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


export {
    addCustomer,
    getCustomers,
    getCustomer,
    editCustomerInfo,
    deleteCustomer
};