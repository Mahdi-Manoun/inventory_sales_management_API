import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Password is required.' },
            len: { args: [8, 100], msg: 'Password must be at least 8 characters long.' }
        }
    },
}, {
    tableName: 'users',
    timestamps: true,

    hooks: {
        // Encrypt the password before creating a new user.
        beforeCreate: async (user) => {
            if (user.passwordHash) {
                const salt = await bcrypt.genSalt(10);
                user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
            }
        },

        // Encrypt the password before updating it
        beforeUpdate: async (user) => {
            if (user.changed('passwordHash')) {  // Ensures hashing only if password is updated
                const salt = await bcrypt.genSalt(10);
                user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
            }
        }
    }
});

// Method to generate JWT
User.prototype.generateAuthToken = function () {
    return jwt.sign(
        { id: this.id, username: this.username, email: this.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '3h' }
    );
};


User.login = async function (userInput, password) {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                { username: userInput },
                { email: userInput }
            ]
        }
    });

    if (!user) {
        throw new Error("Username / email or password are invalid.");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!user || !isMatch) {
        throw new Error("Username / email or password are invalid.");
    }

    return user;
};



export default User;