import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Supplier from './Supplier.js';

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Product name is required.' },
            notEmpty: { msg: 'Product name cannot be empty.' }
        }
    },
    category: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: { msg: 'Category cannot be empty.' }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notNull: { msg: 'Price is required.' },
            min: {
                args: [0.01],
                msg: 'Price must be greater than 0.'
            },
            isDecimal: { msg: 'Price must be a valid decimal number.' }
        }
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Stock quantity is required.' },
            min: {
                args: [0],
                msg: 'Stock quantity must be a non-negative number.'
            },
            isInt: { msg: 'Stock quantity must be an integer.' }
        }
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        references: { model: Supplier, key: 'id' },
        allowNull: false,
        validate: {
            notNull: { msg: 'Supplier ID is required.' }
        }
    }
}, {
    tableName: 'products',
    timestamps: true
});

export default Product;
