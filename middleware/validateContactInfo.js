import validator from 'validator';
import Customer from '../models/Customer.js';
import { Op } from 'sequelize';
import Supplier from '../models/Supplier.js';

const validateContactInfo = async (req, res, next) => {
    const { id } = req.params;
    let { username, name, email, phone_number } = req.body;

    username = username?.trim();
    name = name?.trim();
    email = email?.trim();
    phone_number = phone_number?.trim();

    const isCustomer = req.originalUrl.includes('customer');
    const Model = isCustomer ? Customer : Supplier;

    try {
        // Validate email and phone format
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        if (phone_number && !validator.isMobilePhone(phone_number)) {
            return res.status(400).json({ error: 'Invalid phone number.' });
        }

        if (req.method === 'PATCH') {
            // Validate ID
            if (!Number.isInteger(Number(id)) || id <= 0) {
                return res.status(400).json({ error: 'Invalid workspace ID.' });
            }

            // Check if email exists in other records (excluding the current one)
            if (email) {
                const existingEmail = await Model.findOne({ where: { email, id: { [Op.ne]: id } } });
                if (existingEmail) {
                    return res.status(400).json({ error: `Email ${email} already exists.` });
                }
            }

            // Check if phone number exists for customers
            if (isCustomer && phone_number) {
                const existingPhoneNumber = await Customer.findOne({ where: { phone: phone_number, id: { [Op.ne]: id } } });
                if (existingPhoneNumber) {
                    return res.status(400).json({ error: `Phone number ${phone_number} already exists.` });
                }
            }
        } else {
            // Validate required fields for POST request
            const emptyFields = [];
            if (isCustomer) {
                if (!name) emptyFields.push('name');
                if (!phone_number) emptyFields.push('phone_number');
            } else {
                if (!username) emptyFields.push('username');
            }
            if (!email) emptyFields.push('email');

            if (emptyFields.length > 0) {
                return res.status(400).json({ error: `The following fields are required: "${emptyFields.join(', ')}".` });
            }

            // Check if email exists
            const existingEmail = await Model.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({ error: `Email ${email} already exists.` });
            }

            // Check if phone number exists for customers
            if (isCustomer) {
                const existingPhoneNumber = await Customer.findOne({ where: { phone: phone_number } });
                if (existingPhoneNumber) {
                    return res.status(400).json({ error: `Phone number ${phone_number} already exists.` });
                }
            }
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export default validateContactInfo;