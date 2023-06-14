const { Users } = require("../models/user.model")
const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const dotenv = require("dotenv");
const { User } = require("../class/user.class");
dotenv.config();

router.post('/', async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) return res.sendStatus(401);
        const user = await Users.findOne({
            where: {
                refresh_token: refresh_token
            }
        });
        if (!user) return res.sendStatus(403);
        
        let _user = new User(user);

        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = _user.id;
            const name = _user.fullName;
            const email = _user.email;
            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;