const express = require("express");
const router = express.Router();
const { Products, StockIn, StockOut } = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const stockOut = await StockOut.findAndCountAll({
            order: [["date", "DESC"]],
            limit: limit,
            offset: offset,
        })
        const response = GetPagingData(stockOut, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})


module.exports = router;
