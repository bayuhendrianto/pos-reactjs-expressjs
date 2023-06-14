const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const db = require("../config/db");
const moment = require("moment");


router.get("/", (req, res) => {
    try {
        res.status(200).json({message: "Bookings"})
    } catch (error) {
        res.status(400).json({message: "Error"})
    }
})

module.exports = router;
