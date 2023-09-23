const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const { SECRET_KEY, authenticateJwt } = require('./client');



const UserSchema = new mongoose.Schema({
    UserId: Number,
    Email: String,
    Password: String
},
    { collection: 'usermaster' });

const userModel = mongoose.model('usermaster', UserSchema);

const createToken = function (user) {
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
    return token;
}

router.post('/signup', async (req, res) => {
    var user = {
        Email: req.body.userEmail,
        Password: req.body.pswd
    }
    var findEmail = await userModel.findOne({ Email: user.Email });

    if (findEmail) {
        res.status(409).send({ message: "Email already registered" });
    }
    else {
        const newUserId = await generateUserId();
        console.log(newUserId);
        user.UserId = newUserId;
        const newUser = new userModel(user);
        await newUser.save();
        const token = createToken(user);
        res.send({
            message: "User created successfully",
            token: token
        });
    }

});

router.post('/login', async (req, res) => {
    const user = {
        Email: req.body.email,
        Password: req.body.password
    };
    console.log(user);
    const userInMongo = await userModel.findOne(user);

    if (userInMongo) {
        user.UserId = userInMongo.UserId;
        const token = createToken(user);
        res.send({ message: "Log In successfull", token: token });
    }
    else {
        res.status(401).send({ message: "Incorrect username or password" });
    }
});

router.post('/logout', authenticateJwt, (req, res) => {
    const expireToken = jwt.sign({}, SECRET_KEY, { expiresIn: '0s' });

    res.send({ message: "Logged out successfully", token: expireToken });
});

router.get('/hello', authenticateJwt, (req, res) => {
    res.send({ "message": "This is working" });
});

const generateUserId = async () => {
    const latestUser = await userModel.find().sort({ UserId: -1 }).limit(1);
    console.log(latestUser);
    if (latestUser && latestUser.length > 0) {
        return Number(latestUser[0].UserId) + 1;
    }
    return 1;
}

module.exports = router;