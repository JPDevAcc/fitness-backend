import User from './models/user.mjs';
import crypto from 'crypto';

export const authenticate = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(401).send({ message: 'Invalid email / password' });
    else if (user.password !== req.body.password) res.status(401).send({ message: 'Invalid email / password' });
    else {
        // Old token stuff
        const token = crypto.randomBytes(16).toString('base64');
        user.token = token;
        await user.save();

        req.session.regenerate(function (err) {
            if (err) next(err)

            // store user information in session, typically a user id
            req.session.userId = user._id;
            console.log("Database ID:", user._id);

            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) return next(err)
                res.send({ token });
                // res.redirect('/')
            })
        })
    }
}

export const authorize = async (req, res, next) => {
    console.log("printing id: ", req.session.userId)
    const token = req.headers['token'];

    let ok = true;

    if (!req.session.userId) ok = false;
    if (ok) {
        const user = await User.findOne({ _id: req.session.userId });
        if (!user) ok = false;
    }

    if (!token) ok = false;

    if (ok) {
        const user = await User.findOne({ token });
        if (!user) ok = false;
    }

    if (ok) next();
    else res.status(401).send();
}
