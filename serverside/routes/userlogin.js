const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const SECRET_KEY = 'MY_SECRET_KEY';

const UserSchema = new mongoose.Schema({
    UserId: Number,
    Email: String,
    Password: String
},
    { collection: 'usermaster' });

const userModel = mongoose.model('usermaster', UserSchema);

const authenticateJwt = async (req, res, next) => {
    const tokenBody = req.headers.authorization;
    if (tokenBody) {
        const token = tokenBody.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, ans) => {
            if (err) res.status(404).send({ message: "Forbidden Access" });

            next();
        });
    }
    res.status(401).send({ message: "Authentication failed" });
}

const createToken = function (user) {
    const token = jwt.sign(user.Email, SECRET_KEY, { expiresIn: '1h' });
    return token;
}

router.post('/signup', async (req, res) => {
    var user = {
        UserId: generateUserId(),
        Email: req.body.userEmail,
        Password: req.body.pswd
    }
    var findEmail = await userModel.findOne({ Email: user.Email });

    if (findEmail) {
        res.status(403).send({ message: "Email already registered" });
    }
    else {
        const newUser = new userModel(user);
        await newUser.save();
        const token = createToken(user);
        res.send({
            message: "User created successfully",
            token: token
        });
    }

});

router.get('/hello', authenticateJwt, (req, res) => {
    res.send({ "message": "This is working" });
});

const generateUserId = async () => {
    const latestUser = await userModel.find().sort({ UserId: -1 }).limit(1);
    if (latestUser) {
        return latestUser.UserId + 1;
    }
    return 1;
}

module.exports = router;