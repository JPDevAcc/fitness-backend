import User from './models/user.mjs';
import crypto from 'crypto';

export const authenticate = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(401).send({ message: 'Invalid email / username address' });
    else if (user.password !== req.body.password) res.status(401).send({ message: 'Invalid password' });
    else {
        const token = crypto.randomBytes(16).toString('base64');
        user.token = token;
        await user.save();
        res.send({ token });
    }
}

export const authorize = async (req, res, next) => {
    const token = req.headers['token'];

    let ok = true;

    if (!token) ok = false;

    if (ok) {
        const user = await User.findOne({ token });
        if (!user) ok = false;
    }

    if (ok) next();
    else res.status(401).send();
}
