import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Invoice from './Invoice.js';
import Product from './Product.js';

const Sale = sequelize.define('Sale', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoice_id: {
        type: DataTypes.INTEGER,
        references: { model: Invoice, key: 'id' },
        allowNull: false,
        validate: {
            notNull: { msg: 'Invoice ID is required.' }
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: { model: Product, key: 'id' },
        allowNull: false,
        validate: {
            notNull: { msg: 'Product ID is required.' }
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Quantity is required.' },
            min: {
                args: [1],
                msg: 'Quantity must be greater than or equal to 1.'
            },
            isInt: { msg: 'Quantity must be an integer.' }
        }
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notNull: { msg: 'Total price is required.' },
            min: {
                args: [0.01],
                msg: 'Total price must be greater than 0.'
            },
            isDecimal: { msg: 'Total price must be a valid decimal number.' }
        }
    }
}, {
    tableName: 'sales',
    timestamps: true
});

export default Sale;
