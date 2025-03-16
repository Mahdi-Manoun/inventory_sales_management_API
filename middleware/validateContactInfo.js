import { Op } from 'sequelize';
import validator from 'validator';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';

const validateContactInfo = async (req, res, next) => {
    const { customer_id, supplier_id } = req.params;
    const { email, phone_number } = req.body;

    try {
        // Validate email and phone format
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        if (phone_number && !validator.isMobilePhone(phone_number)) {
            return res.status(400).json({ error: "Invalid phone number." });
        }

        // Determine the appropriate model (Customer or Supplier)
        let model = null;
        let id = null;

        if (customer_id) {
            model = Customer;
            id = customer_id;
        } else if (supplier_id) {
            model = Supplier;
            id = supplier_id;
        } else {
            return res.status(400).json({ error: "Missing customer_id or supplier_id." });
        }

        if (req.method === "PATCH") {
            // Check if email/phone exists in other records (excluding current one)
            if (email) {
                const existingEmail = await model.findOne({
                    where: { email, id: { [Op.ne]: id } },
                });

                if (existingEmail) {
                    return res.status(400).json({ error: `Email ${email} already exists.` });
                }
            }

            if (phone_number) {
                const existingPhoneNumber = await model.findOne({
                    where: { phone: phone_number, id: { [Op.ne]: id } },
                });

                if (existingPhoneNumber) {
                    return res.status(400).json({ error: `Phone number ${phone_number} already exists.` });
                }
            }
        } else {
            // For POST requests, check if email/phone exist in any record
            const existingEmail = await model.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({ error: `Email ${email} already exists.` });
            }

            const existingPhoneNumber = await model.findOne({ where: { phone: phone_number } });
            if (existingPhoneNumber) {
                return res.status(400).json({ error: `Phone number ${phone_number} already exists.` });
            }
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};

export default validateContactInfo;