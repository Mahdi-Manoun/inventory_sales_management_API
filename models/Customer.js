import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Customer name is required.' },
            notEmpty: { msg: 'Customer name cannot be empty.' }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: { msg: 'Please provide a valid email address.' },
            notNull: { msg: 'Email is required.' }
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: [/^\+?[1-9]\d{1,14}$/],
                msg: 'Please provide a valid phone number.'
            }
        }
    }
}, {
    tableName: 'customers',
    timestamps: true
});

export default Customer;
