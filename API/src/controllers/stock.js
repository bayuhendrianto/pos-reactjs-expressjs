const express = require("express");
const router = express.Router();
const { Products } = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const { ProductInDetailList, ProductInList, ProductList } = require("../class/product.class");
const db = require("../config/db");
dotenv.config();

router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : '';

    try {
        const [countResult, countMetaData] = await db.query(`
            SELECT count(products.id) AS count FROM products
            LEFT JOIN units
            ON units.id=products.unit
            LEFT JOIN categories
            ON categories.id=products.category
            WHERE
            products.name LIKE '%${search}%'
            OR
            products.code LIKE '%${search}%'
            ORDER BY products.name ASC
        `);

        const [results, resultMeta] = await db.query(`
            SELECT 
            products.id,
            products.thumb,
            products.sku,
            products.name,
            products.price,
            products.discoundCode,
            products.discountPercent,
            products.priceAfterDiscount,
            products.taxPercent,
            products.tax,
            products.priceWithTax,
            products.totalPrice,
            products.description,
            products.brand,
            products.code,
            products.purchasePrice,
            products.sellingPrice,
            products.quantity,
            products.minQuantity,
            products.incomingQuantity,
            products.quantitySold,
            products.quantityOut,
            products.differenceQuantity,
            products.isActive,
            products.isFavorite,
            products.barcode,
            products.profitInPercent,
            products.createdBy,
            products.updatedBy,
            products.createdAt,
            products.updatedAt,
            products.deletedAt,
            units.name as unit,
            categories.name as category
            FROM products
            LEFT JOIN units
            ON units.id=products.unit
            LEFT JOIN categories
            ON categories.id=products.category
            WHERE
            products.name LIKE '%${search}%'
            OR
            products.code LIKE '%${search}%'
            ORDER BY products.name ASC
            LIMIT ${offset}, ${limit}
        `);

        var data = {
            count: countResult[0].count,
            rows: results,
        };

        const response = GetPagingData(data, limit);
        response.result = new ProductList(response.result)
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error" });
    }
})


module.exports = router;
