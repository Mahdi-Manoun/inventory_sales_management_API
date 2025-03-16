import validator from 'validator';
import User from '../models/User.js';

const validateUsernameOrEmail = async (req, res, next) => {
    let { userInput, username, email } = req.body;

    username = username?.trim();
    email = email?.trim();

    // Validate username and email
    if (username && !validator.isAlphanumeric(username)) {
        return res.status(400).json({ error: 'Username can only contain letters and numbers.' });
    }

    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const isSignup = req.originalUrl.includes('signup');
    const isLogin = req.originalUrl.includes('login');

    // Ensure fields are provided for signup
    if (isSignup) {
        let emptyFields = [];
        if (!username) emptyFields.push('username');
        if (!email) emptyFields.push('email');

        if (emptyFields.length > 0) {
            return res.status(400).json({ error: `The following fields are required: "${emptyFields.join(', ')}".` });
        }
    }

    // Validate login fields
    if (isLogin) {
        if (!userInput) {
            return res.status(400).json({ error: 'You must provide either username or email during login.' });
        }
    }

    // Check for existing username or email
    const existingUsername = username ? await User.findOne({ where: { username } }) : null;
    const existingEmail = email ? await User.findOne({ where: { email } }) : null;

    // checks if username/email exists or not
    if (isSignup) {
        let duplicateFields = [];
        if (existingUsername) duplicateFields.push('username');
        if (existingEmail) duplicateFields.push('email');

        if (duplicateFields.length > 0) {
            return res.status(400).json({ error: `The ${duplicateFields.join(' and ')} already exists. Please choose another one.` });
        }
    }

    next();
};

export default validateUsernameOrEmail;