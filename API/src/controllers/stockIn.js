const express = require("express");
const router = express.Router();
const { Products, StockIn, ProductIn, Employees, Suppliers } = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const db = require("../config/db");
const { StockInClass } = require("../class/stock.class");
const { ProductInList, ProductInDetailList, StockInDetailResults } = require("../class/product.class");
dotenv.config();

router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const stockIn = await StockIn.findAndCountAll({
            order: [["date", "DESC"]],
            limit: limit,
            offset: offset,
        })
        const response = GetPagingData(stockIn, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Error" });
        console.log(error);
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const stockIn = await StockIn.findByPk(id);

        if (stockIn) {
            const stockInResult = new StockInClass(stockIn);

            const [user, supplier] = await Promise.all([
                Employees.findByPk(stockInResult.userId, {
                    attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber']
                }),
                Suppliers.findByPk(stockInResult.supplierId, {
                    attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber']
                })
            ])

            const [result, resultMeta] = await db.query(`
                SELECT product_in.id as productInId,
                product_in.id as productInId,
                product_in.date as productInDate,
                product_in.productId as productInProductId,
                product_in.stockInId as productInStockInId,
                product_in.totalQuantity as productInTotalQuantity,
                product_in.totalPrice as productInTotalPrice,
                product_in.totalTax as productInTotalTax,
                product_in.totalPriceAfterTax as productInTotalPriceAfterTax,
                product_in.totalDiscountPercent as productInTotalDiscountPercent,
                product_in.totalDiscount as productInTotalDiscount,
                product_in.transactionId as productIntransactionId,
                product_in.status as productInStatus,
                product_in.createdBy as productInCreatedBy,
                product_in.updatedBy as productInUpdatedBy,
                products.id as productId,
                products.thumb as productThum,
                products.sku as productSku,
                products.name as productName,
                products.price as productPrice,
                products.discoundCode as productDiscoundCode,
                products.discountPercent as productDiscountPercent,
                products.priceAfterDiscount as productPriceAfterDiscount,
                products.taxPercent as productTaxPercent,
                products.tax as productTax,
                products.priceWithTax as productPriceWithTax,
                products.unit as productUnit,
                products.totalPrice as productTotalPrice,
                products.description as productDescription,
                products.brand as productBrand,
                products.category as productCategory,
                products.code as productCode,
                products.purchasePrice as productPurchasePrice,
                products.sellingPrice as productSellingPrice,
                products.quantity as productQuantity,
                products.minQuantity as productMinQuantity,
                products.incomingQuantity as productIncomingQuantity,
                products.quantitySold as productQuantitySold,
                products.quantityOut as productQuantityOut,
                products.differenceQuantity as productDifferenceQuantity,
                products.isActive as productIsActive,
                products.isFavorite as productIsFavorite,
                products.barcode as productBarcode,
                products.profitInPercent as productProfitInPercent,
                products.createdBy as productCreatedBy,
                products.updatedBy as productUpdatedBy,
                units.code as unitCode,
                units.name as unitName,
                categories.code as categoryCode,
                categories.name as categoryName
                FROM product_in
                LEFT JOIN products
                ON products.id = product_in.productId
                LEFT JOIN units
                ON units.id=products.unit
                LEFT JOIN categories
                ON categories.id=products.category
                WHERE product_in.stockInId='${stockInResult.id}'
            `);

            return res.status(200).json({
                message: 'success',
                stockInDetail: new StockInDetailResults(stockInResult, result),
                user: user,
                supplier: supplier
            })
        } else {
            res.status(400).json({ message: "Not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error" });
    }
})

router.post('/new', async (req, res) => {

    let { stockIn, products } = req.body;
    const _transactionStockIn = await StockIn.sequelize.transaction(),
        _transactionProductIn = await ProductIn.sequelize.transaction();

    if (!stockIn) {
        return res.status(404).json({ message: 'Data not found' })
    }

    if (!products) {
        return res.status(404).json({ message: 'Data not found' })
    }

    if (products && products.length === 0) {
        return res.status(404).json({ message: 'Data not found' })
    }

    stockIn['id'] = uuid();
    products.forEach((item, index) => {
        item['id'] = uuid();
        item['stockInId'] = stockIn.id;
    })

    try {

        StockIn.create(stockIn, _transactionStockIn);
        ProductIn.bulkCreate(products, _transactionProductIn)

        await Promise.all([
            _transactionStockIn.commit(),
            _transactionProductIn.commit()
        ]);

        return res.status(200).json({ message: "Success" })

    } catch (error) {
        console.log(error)
        await Promise.all([
            _transactionStockIn.rollback(),
            _transactionProductIn.rollback()
        ]);
        res.status(400).json({ message: "Ërror" });
    }
})


module.exports = router;
