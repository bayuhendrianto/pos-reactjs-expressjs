const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const { v4: uuid } = require("uuid");

const dotenv = require("dotenv");
const { User } = require("../class/user.class");
const { Categories } = require("../models/category.model");
dotenv.config();
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");

router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    try {
        const categories = await Categories.findAndCountAll({
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
        const categories = await Categories.findAll({
            order: [["name", "ASC"]]
        })
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})

router.post('/new', async (req, res) => {

    let data = {
        id: uuid(),
        name: req.body.name,
        code: req.body.code
    }

    let findByCode = await Categories.findOne({
        where: {
            code: data.code
        }
    })

    if (findByCode) {
        return res.status(400).json({ message: `Kategori dengan kode ${data.code} sudah ada` })
    }

    try {
        await Categories.create(data)
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

router.put('/update', async (req, res) => {

    let findCategoryByCode = await Categories.findOne({
        where: {
            code: req.body.code,
            id: {
                [Op.ne]: req.body.id
            }
        }
    })

    if (findCategoryByCode) {
        return res.status(400).json({message: `Kode ${req.body.code} sudah digunakan untuk kategori lain`})
    }

    try {
        await Categories.update(req.body, {
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