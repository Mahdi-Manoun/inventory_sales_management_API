import User from '../models/User.js';

const signup = async (req, res) => {
    const { username, email, password } = req.body

    try {
        await User.create({ username, email, passwordHash: password });
        return res.status(201).json({ message: `${username} created successfully!` });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


const login = async (req, res) => {
    try {
        const { userInput, password } = req.body; // input: username or email + password

        // use login method
        const user = await User.login(userInput, password);

        // generate new token
        const token = user.generateAuthToken();

        return res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

export {
    signup,
    login
};