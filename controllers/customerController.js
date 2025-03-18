import Customer from '../models/Customer.js';

// add a customer
const addCustomer = async (req, res) => {
    const { name, email, phone_number } = req.body;

    try {
        const customer = await Customer.create({ name, email, phone: phone_number });

        return res.status(201).json({
            message: `${name} added successfully!`,
            customer
        });
    } catch (error) {
        console.log(error);
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
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${id} was not found.`
            });
        }

        return res.status(200).json(customer);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// edit customer's info
const editCustomerInfo = async (req, res) => {
    const { id } = req.params;
    let { customer_name, email, phone_number } = req.body;

    try {
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${id} was not found.`
            });
        }

        customer.name = customer_name || customer.name;
        customer.email = email || customer.email;
        customer.phone = phone_number || customer.phone;

        await customer.save();

        return res.status(200).json({
            message: `Customer with ID ${id} updated successfully!`,
            customer
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// delete a customer
const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const existingCustomer = await Customer.findByPk(id);

        if (!existingCustomer) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${id} was not found.`
            });
        }

        await existingCustomer.destroy();

        return res.status(200).json({ message: `Customer with ID ${id} has been deleted successfully!` });
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