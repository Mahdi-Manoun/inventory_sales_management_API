import Customer from '../models/Customer.js';

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
            message: `Customer with ID ${customer_id} updated successfully.`,
            customer
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


export {
    addCustomer,
    editCustomerInfo
};