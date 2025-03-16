import validator from 'validator';
import Customer from '../models/Customer.js';
import { Op } from 'sequelize';

const validateContactInfo = async (req, res, next) => {
    const { customer_id } = req.params;
    const { email, phone_number } = req.body;

    try {
        // Validate email and phone format
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        if (phone_number && !validator.isMobilePhone(phone_number)) {
            return res.status(400).json({ error: 'Invalid phone number.' });
        }

        if (req.method === 'PATCH') {
            // Check if email/phone exists in other customers (not the current one)
            if (email) {
                const existingEmail = await Customer.findOne({
                    where: { email, id: { [Op.ne]: customer_id } }
                });

                if (existingEmail) {
                    return res.status(400).json({ error: `Email ${email} already exists.` });
                }
            }

            if (phone_number) {
                const existingPhoneNumber = await Customer.findOne({
                    where: { phone: phone_number, id: { [Op.ne]: customer_id } }
                });

                if (existingPhoneNumber) {
                    return res.status(400).json({ error: `Phone number ${phone_number} already exists.` });
                }
            }
        } else {
            // For POST request, check if email/phone are exists or not.
            if (email) {
                const existingEmail = await Customer.findOne({ where: { email } });
                if (existingEmail) {
                    return res.status(400).json({ error: `Email ${email} already exists.` });
                }
            }

            if (phone_number) {
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