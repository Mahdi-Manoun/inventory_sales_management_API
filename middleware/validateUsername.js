import Supplier from '../models/Supplier.js';
import { Op } from 'sequelize';

const validateUsername = async (req, res, next) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        if (req.method === 'POST') {
            const existingUsername = await Supplier.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ error: `Username ${username} already exists.` });
            }
        } else {
            const existingUsername = await Supplier.findOne({ where: { username, id: { [Op.ne]: id } } });

            if (existingUsername) {
                return res.status(400).json({ error: `Username ${username} already exists.` });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }

    next();
}

export default validateUsername;