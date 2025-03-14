import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Customer from './Customer.js';

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: { model: Customer, key: 'id' },
        allowNull: false,
        validate: {
            notNull: { msg: 'Customer ID is required.' }
        }
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notNull: { msg: 'Total amount is required.' },
            min: {
                args: [0.01],
                msg: 'Total amount must be greater than 0.'
            },
            isDecimal: { msg: 'Total amount must be a valid decimal number.' }
        }
    }
}, {
    tableName: 'invoices',
    timestamps: true
});

export default Invoice;
