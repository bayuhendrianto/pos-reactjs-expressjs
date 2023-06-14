const express = require("express");
const router = express.Router();
const { Products, StockIn, StockOut, Transactions, PurchaseOrders, PurchaseProduct, Suppliers, Employees } = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const { PurchaseOrderList, PurchaseOrderClass } = require("../class/transaction.class");
const { PurchaseProductDetailClass, PurchaseProductDetailList, PurchaseOrderResults } = require("../class/product.class");
const db = require("../config/db");
dotenv.config();

router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const transactions = await Transactions.findAndCountAll({
            order: [["date", "DESC"]],
            limit: limit,
            offset: offset,
        })
        const response = GetPagingData(transactions, limit);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})

router.get('/get-by-id/:id', (req, res) => {
    const { id } = req.params;
    try {
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" });
    }
})

router.post('/new', (req, res) => {
    try {
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" });
    }
})

router.put('/update', (req, res) => {
    try {
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" });
    }
})

router.get('/purchase-order', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const purchaseOrders = await PurchaseOrders.findAndCountAll({
            order: [["date", "DESC"]],
            where: {
                [Op.or]: [
                    {
                        invoiceNumber: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    }
                ],
            },
            limit: limit,
            offset: offset,
        })
        const response = GetPagingData(purchaseOrders, limit);
        response.result = new PurchaseOrderList(response.result)
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})

router.get('/purchase-order/active', async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrders.findAll({
            order: [["date", "DESC"]],
            attributes: ['id','invoiceNumber', 'userId', 'supplierId'],
            where: {
                status: {
                    [Op.or]: ["NEW", "ONPROGRESS", "DELIVER", "PENDING"]
                }
            }
        });
        
        res.status(200).json(purchaseOrders);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
})

router.get('/purchase-order/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const purchaseOrder = await PurchaseOrders.findByPk(id);

        if (purchaseOrder) {
            const purchaseOrderResult = new PurchaseOrderClass(purchaseOrder);
            const [user, supplier] = await Promise.all([
                Employees.findByPk(purchaseOrderResult.userId, {
                    attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber']
                }),
                Suppliers.findByPk(purchaseOrderResult.supplierId, {
                    attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber']
                })
            ])

            const [result, resultMeta] = await db.query(`
                SELECT purchase_product.id as purchaseProductId,
                purchase_product.date as purchaseProductDate,
                purchase_product.productId as purchaseProductProductId,
                purchase_product.purchaseOrderId as purchaseProductPurchaseOrderId,
                purchase_product.totalQuantity as purchaseProductTotalQuantity,
                purchase_product.differenceQuantity as purchaseProductDifferenceQuantity,
                purchase_product.quantityTaken as purchaseProductQuantityTaken,
                purchase_product.totalPrice as purchaseProductTotalPrice,
                purchase_product.totalTax as purchaseProductTotalTax,
                purchase_product.totalPriceAfterTax as purchaseProductTotalPriceAfterTax,
                purchase_product.totalDiscountPercent as purchaseProductTotalDiscountPercent,
                purchase_product.totalDiscount as purchaseProductTotalDiscount,
                purchase_product.transactionId as purchaseProducttransactionId,
                purchase_product.createdBy as purchaseProductCreatedBy,
                purchase_product.updatedBy as purchaseProductUpdatedBy,
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
                FROM purchase_product
                LEFT JOIN products
                ON products.id = purchase_product.productId
                LEFT JOIN units
                ON units.id=products.unit
                LEFT JOIN categories
                ON categories.id=products.category
                WHERE purchase_product.purchaseOrderId='${purchaseOrderResult.id}'
            `);

            return res.status(200).json({
                message: 'success',
                purchaseOrder: new PurchaseOrderResults(purchaseOrderResult, result),
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

router.post('/purchase-order/new', async (req, res) => {

    let { purchaseOrder, purchaseProducts } = req.body;
    const _transactionPurchaseOrder = await PurchaseOrders.sequelize.transaction(),
        _transactionPurchaseProduct = await PurchaseProduct.sequelize.transaction();

    if (!purchaseOrder) {
        return res.status(404).json({ message: 'Data not found' })
    }

    if (!purchaseProducts) {
        return res.status(404).json({ message: 'Data not found' })
    }

    if (purchaseProducts && purchaseProducts.length === 0) {
        return res.status(404).json({ message: 'Data not found' })
    }

    purchaseOrder['id'] = uuid();
    purchaseProducts.map((item) => {
        item['id'] = uuid();
        item['purchaseOrderId'] = purchaseOrder['id'];
        item['differenceQuantity'] = item['totalQuantity'];
    })

    try {

        PurchaseOrders.create(purchaseOrder, _transactionPurchaseOrder);
        PurchaseProduct.bulkCreate(purchaseProducts, _transactionPurchaseProduct);

        await Promise.all([
            _transactionPurchaseOrder.commit(),
            _transactionPurchaseProduct.commit()
        ]);

        res.status(200).json({ message: "Success" });
    } catch (error) {

        await Promise.all([
            _transactionPurchaseOrder.rollback(),
            _transactionPurchaseProduct.rollback()
        ]);

        res.status(400).json({ message: "Error" });
    }
})

router.put('/purchase-order/update', (req, res) => {
    try {
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: "Error" });
    }
})


module.exports = router;
