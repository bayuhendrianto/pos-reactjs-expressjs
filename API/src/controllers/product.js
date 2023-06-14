const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const { v4: uuid } = require("uuid");

const dotenv = require("dotenv");
const { User } = require("../class/user.class");
dotenv.config();
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const { Products, ProductIn } = require("../models/product.model");
const { ProductClass, ProductList } = require("../class/product.class");

const XLSX = require("xlsx");
const { Categories } = require("../models/category.model");
const { Units } = require("../models/unit.model");

const sharp = require("sharp");
const path = require('path');
const originUrl = "http://localhost:3000/";
const multer = require("multer");
const util = require("util");
const fs = require("fs")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const products = await Products.findAndCountAll({
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
        const response = GetPagingData(products, limit);
        response.result = new ProductList(response.result)
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})

router.post('/upload-excel', upload.single("file"), (req, res) => {
    if (!req.files) {
        return res.status(404).json({ message: "File not found !" })
    }
    try {

        const { buffer } = req.file;
        let readFileBuffer = XLSX.read(buffer, { type: "buffer" })

        let result = []
        const sheets = readFileBuffer.SheetNames
        for (let i = 0; i < sheets.length; i++) {
            const temp = XLSX.utils.sheet_to_json(readFileBuffer.Sheets[readFileBuffer.SheetNames[i]])
            temp.forEach((res) => {
                result.push(res)
            })
        }

        let errorItem = [];
        result.forEach(async (item, index) => {
            item['id'] = uuid();
            item['discount'] = item['discount'] === "null" ? null : item['discount'];
            item['priceAfterDiscount'] = item['priceAfterDiscount'] === "null" ? null : item['priceAfterDiscount'];
            item['taxPercent'] = item['taxPercent'] === "null" ? null : item['taxPercent'];
            item['priceWithTax'] = item['priceWithTax'] === "null" ? null : item['priceWithTax'];

            if (item?.['category'] && item?.['category'] !== "null") {
                let findCategory = await Categories.findOne({ where: { code: item['category'] } })
                if (findCategory) {
                    item['category'] = findCategory['dataValues']['id']
                } else {
                    errorItem.push({ message: `Kode kategori ${item['category']} tidak ditemukan` })
                }
            } else {
                errorItem.push({ message: 'Kode kategori wajib di isi' })
            }

            if (item?.['unit'] && item?.['unit'] !== "null") {
                let findUnit = await Units.findOne({ where: { code: item['unit'] } })
                if (findUnit) {
                    item['unit'] = findUnit['dataValues']['id']
                } else {
                    errorItem.push({ message: `Kode satuan ${item['unit']} tidak ditemukan` })
                }
            } else {
                errorItem.push({ message: 'Kode satuan wajib di isi' })
            }

            let findProductByCode = await Products.findOne({ where: { code: item['code'] } })
            let findProductBySku = await Products.findOne({ where: { code: item['sku'] } })

            if (findProductByCode) {
                errorItem.push({ message: `Product with code ${item['code']} exist !` })
            }

            if (findProductBySku) {
                errorItem.push({ message: `Product with sku ${item['sku']} exist !` })
            }

            if (index === (result.length - 1)) {
                if (errorItem.length > 0) {
                    return res.status(400).json({ message: errorItem[0]['message'] })
                } else {
                    await Products.bulkCreate(result)
                    return res.status(200).json(result)
                }
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error", error })
    }
})

router.get('/get-by-id/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({ message: "ID Not found !" })
    }
    try {
        const products = await Products.findByPk(id)
        res.status(200).json(new ProductClass(products));
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})


router.post('/new', async (req, res) => {

    let productData = new ProductClass(req.body);
    productData.id = uuid();

    let findByCode = await Products.findOne({
        where: {
            code: productData.code
        }
    })

    let findBySku = await Products.findOne({
        where: {
            sku: productData.sku
        }
    })

    if (findByCode) {
        return res.status(400).json({ message: `Produk dengan kode ${productData.code} sudah ada` })
    }

    if (findBySku) {
        return res.status(400).json({ message: `Produk dengan sku ${productData.sku} sudah ada` })
    }

    try {
        await Products.create(productData)
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

router.put('/update', async (req, res) => {

    let findProductByCode = await Products.findOne({
        where: {
            code: req.body.code,
            id: {
                [Op.ne]: req.body.id
            }
        }
    })

    let findProductBySku = await Products.findOne({
        where: {
            sku: req.body.sku,
            id: {
                [Op.ne]: req.body.id
            }
        }
    })

    if (findProductByCode) {
        return res.status(400).json({message: `Kode ${req.body.code} sudah digunakan untuk produk lain`})
    }

    if (findProductBySku) {
        return res.status(400).json({message: `Sku ${req.body.sku} sudah digunakan untuk produk lain`})
    }

    try {

        await Products.update(req.body, {
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