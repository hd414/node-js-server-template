const User = require('../../models/user');

exports.signUp = async (req, res) => {
    const { firstName, lastName, email, password, contactNumber } = req.body;
    const user = new User({ firstName, lastName, email, password, contactNumber, role: 'admin' });

    try {
        await user.save();
        // res.status(201).send(user);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    }
    catch (e) {
        res.status(400).send(`${Object.keys(e.keyValue)[0]} "${Object.values(e.keyValue)[0]}" is already registered `);
    }


};


exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password, 'admin')
        if (!user) {
            throw new Error('admin does not exist')
        }
        const token = await user.generateAuthToken()

        res.status(200).send({ user, token })
    } catch (e) {
        res.status(403).send(e.message)
    }

};

exports.signOut = async (req, res) => {


    try {
        res.clearCookie('token');
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send("singed Out successfully");
    } catch (e) {
        res.status(500).send({ e });
    }


};