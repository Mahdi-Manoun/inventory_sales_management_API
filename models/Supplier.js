import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Supplier = sequelize.define('Supplier', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Supplier name is required.' },
            len: {
                args: [3, 50],
                msg: 'Supplier name must be between 3 and 50 characters long.'
            }
        }
    },
    contact_info: {
        type: DataTypes.STRING,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email address for contact_info.'
            }
        }
    }
}, {
    tableName: 'suppliers',
    timestamps: true
});

export default Supplier;
