import Supplier from '../models/Supplier.js';

// create a supplier
const createSupplier = async (req, res) => {
    const { username, email } = req.body;

    try {


        const supplier = await Supplier.create({ username, email });

        return res.status(201).json(supplier);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// get all suppliers
const getSuppliers = async (req, res) => {
    try {
        const supplier = await Supplier.findAll();

        if (supplier.length === 0) {
            return res.status(404).json({ message: 'No suppliers found.' });
        }

        return res.status(200).json({ data: supplier });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// get a single supplier
const getSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByPk(id);

        if (!supplier) {
            return res.status(404).json({
                error: 'Supplier not found',
                message: `Supplier with ID ${id} was not found.`
            });
        }

        return res.status(200).json(supplier);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// edit supplier's info
const editSupplierInfo = async (req, res) => {
    const { id } = req.params;
    let { username, email } = req.body;

    try {
        const supplier = await Supplier.findByPk(id);

        if (!supplier) {
            return res.status(404).json({
                error: 'Supplier not found',
                message: `Supplier with ID ${id} was not found.`
            });
        }

        supplier.username = username || supplier.username;
        supplier.email = email || supplier.email;

        await supplier.save();

        return res.status(200).json({ message: `Supplier with ID ${id} updated successfully!` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// delete a supplier
const deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const existingSupplier = await Supplier.findByPk(id);

        if (!existingSupplier) {
            return res.status(404).json({
                error: 'Supplier not found',
                message: `Supplier with ID ${id} was not found.`
            });
        }

        await existingSupplier.destroy();

        return res.status(200).json({ message: `Supplier with ID ${id} has been deleted successfully!` });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


export {
    createSupplier,
    getSuppliers,
    getSupplier,
    editSupplierInfo,
    deleteSupplier
};