const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const { v4: uuid } = require("uuid");

const dotenv = require("dotenv");
const { User } = require("../class/user.class");
dotenv.config();
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const { Units } = require("../models/unit.model");

router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const categories = await Units.findAndCountAll({
            order: [["name", "ASC"]],
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        code: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                ],
            },
            limit: limit,
            offset: offset,
        })
        const response = GetPagingData(categories, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})

router.get('/all', async (req, res) => {
    try {
        const units = await Units.findAll({
            order: [["name", "ASC"]]
        })
        res.status(200).json(units);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})

router.post('upload-excel', (req, res) => {
    
})

router.post('/new', async (req, res) => {

    let data = {
        id: uuid(),
        name: req.body.name,
        code: req.body.code
    }

    let findByCode = await Units.findOne({
        where: {
            code: data.code
        }
    })

    if (findByCode) {
        return res.status(400).json({ message: `Satuan dengan kode ${data.code} sudah ada` })
    }

    try {
        await Units.create(data)
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

router.put('/update', async (req, res) => {

    let findUnitByCode = await Units.findOne({
        where: {
            code: req.body.code,
            id: {
                [Op.ne]: req.body.id
            }
        }
    })

    if (findUnitByCode) {
        return res.status(400).json({message: `Kode ${req.body.code} sudah digunakan untuk satuan lain`})
    }

    try {
        await Units.update(req.body, {
            where: {
                id: req.body.id
            }
        })
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

module.exports = router;