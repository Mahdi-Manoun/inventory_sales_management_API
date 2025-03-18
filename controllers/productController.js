import Product from '../models/Product.js';

// add a product
const addProduct = async (req, res) => {
    const { name, category, price, stock_quantity, supplier_id } = req.body;

    try {
        const emptyFields = [];
        if (!name) emptyFields.push('name');
        if (!category) emptyFields.push('category');
        if (!price) emptyFields.push('price');
        if (!stock_quantity) emptyFields.push('stock_quantity');
        if (!supplier_id) emptyFields.push('supplier_id');

        if (emptyFields.length > 0) {
            return res.status(400).json({ error: `The following fields are required: "${emptyFields.join(', ')}".` });
        }

        if (!Number.isInteger(Number(supplier_id)) || supplier_id <= 0) {
            return res.status(400).json({ error: 'Invalid supplier ID.' });
        }

        if (!Number.isFinite(Number(price)) || price <= 0) {
            return res.status(400).json({ error: 'Invalid price. It must be a positive decimal number.' });
        }

        const product = await Product.create({ name, category, price, stock_quantity, supplier_id });

        return res.status(201).json({
            message: `${name} added successfully!`,
            product
        });
    } catch (error) {
        console.log(error);
    }
}


// get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        if (Product.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        return res.status(200).json({ data: products });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// get a single product
const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
                message: `Product with ID ${id} was not found.`
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


// edit product's info
const editProduct = async (req, res) => {
    const { id } = req.params;
    let { name, category, price, stock_quantity, supplier_id } = req.body;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
                message: `Product with ID ${id} was not found.`
            });
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.stock_quantity = stock_quantity || product.stock_quantity;
        product.supplier_id = supplier_id || product.supplier_id;

        await product.save();

        return res.status(200).json({
            message: `Product with ID ${id} updated successfully!`,
            product
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
}


// delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
                message: `Product with ID ${id} was not found.`
            });
        }

        await product.destroy();

        return res.status(200).json({ message: `Product with ID ${id} has been deleted successfully!` });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

export {
    addProduct,
    getProducts,
    getProduct,
    editProduct,
    deleteProduct
};