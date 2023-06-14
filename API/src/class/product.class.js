const { List } = require("./list.class");

class ProductClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.code = model.code || null;
        this.name = model.name || null;
        this.description = model.description || "";
        this.thumb = model.thumb || null;
        this.sku = model.sku || null;
        this.price = model.price || 0;
        this.discoundCode = model.discoundCode || null;
        this.discountPercent = model.discountPercent || null;
        this.priceAfterDiscount = model.priceAfterDiscount || 0;
        this.taxPercent = model.taxPercent || null;
        this.tax = model.tax || 0;
        this.priceWithTax = model.priceWithTax || 0;
        this.unit = model.unit || null;
        this.totalPrice = model.totalPrice || 0;
        this.totalPriceForPurchase = 0;
        this.brand = model.brand || null;
        this.category = model.category || null;
        this.purchasePrice = model.purchasePrice || 0;
        this.sellingPrice = model.sellingPrice || 0;
        this.quantity = model.quantity || 0;
        this.quantityForPurchase = 0;
        this.minQuantity = model.minQuantity || 0;
        this.incomingQuantity = model.incomingQuantity || 0;
        this.quantitySold = model.quantitySold || 0;
        this.quantityOut = model.quantityOut || 0;
        this.differenceQuantity = model.differenceQuantity || 0;
        this.isActive = model.isActive == 1 ? true : false || false;
        this.isFavorite = model.isFavorite == 1 ? true : false || false;
        this.barcode = model.barcode || null;
        this.profitInPercent = model.profitInPercent || null;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;
    }
}

class ProductSoldClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.productId = model.productId || null;
        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalTax = model.totalTax || 0;
        this.totalPriceAfterTax = model.totalPriceAfterTax || 0;
        this.totalDiscountPercent = model.totalDiscountPercent || null;
        this.totalDiscount = model.totalDiscount || 0;
        this.transactionId = model.transactionId || null;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;
    }
}

class PurchaseProductClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.productId = model.productId || null;
        this.purchaseOrderId = model.purchaseOrderId || null;
        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalTax = model.totalTax || 0;
        this.totalPriceAfterTax = model.totalPriceAfterTax || 0;
        this.totalDiscountPercent = model.totalDiscountPercent || null;
        this.totalDiscount = model.totalDiscount || 0;
        this.transactionId = model.transactionId || null;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;
    }
}

class ProductInClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.productId = model.productId || null;
        this.stockInId = model.stockInId || null;
        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalTax = model.totalTax || nu0ll;
        this.totalPriceAfterTax = model.totalPriceAfterTax || 0;
        this.totalDiscountPercent = model.totalDiscountPercent || null;
        this.totalDiscount = model.totalDiscount || 0;
        this.transactionId = model.transactionId || null;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;
    }
}

class ProductInDetailClass {
    constructor(model) {
        model = model || {};
        this.id = model.productInId || null;
        this.date = model.productInDate || null;
        this.productId = model.productInProductId || null;
        this.stockInId = model.productInStockInId || null;
        this.totalQuantity = model.productInTotalQuantity || 0;
        this.differenceQuantity = model.productInDifferenceQuantity || 0;
        this.totalPrice = model.productInTotalPrice || 0;
        this.totalTax = model.productInTotalTax || 0;
        this.totalPriceAfterTax = model.productInTotalPriceAfterTax || 0;
        this.totalDiscountPercent = model.productInTotalDiscountPercent || null;
        this.totalDiscount = model.productInTotalDiscount || 0;
        this.transactionId = model.productIntransactionId || null;
        this.status = model.productInStatus || null;

        this.createdBy = model.productInCreatedBy || null;
        this.updatedBy = model.productInUpdatedBy || null;

        this.product = {
            id: model.productId || null,
            thumb: model.productThum || null,
            sku: model.productSku || null,
            name: model.productName || null,
            code: model.productCode || null,
            price: model.productPrice || 0,
            discoundCode: model.productDiscoundCode || null,
            discountPercent: model.productDiscountPercent || null,
            priceAfterDiscount: model.productPriceAfterDiscount || 0,
            tax: model.productTax || 0,
            taxPercent: model.productTaxPercent || null,
            priceWithTax: model.priceWithTax || 0,
            totalPrice: model.productTotalPrice || 0,
            description: model.productDescription,
            brand: model.productBrand || null,
            purchasePrice: model.productPurchasePrice || 0,
            sellingPrice: model.productSellingPrice || 0,
            quantity: model.productQuantity || 0,
            minQuantity: model.productMinQuantity || 0,
            incomingQuantity: model.productIncomingQuantity || 0,
            quantitySold: model.productQuantitySold || 0,
            quantityOut: model.productQuantityOut || 0,
            differenceQuantity: model.productDifferenceQuantity || 0,
            isActive: model.productIsActive == 1 ? true : false || false,
            isFavorite: model.productIsFavorite == 1 ? true : false || false,
            barcode: model.productBarcode || null,
            profitInPercent: model.productProfitInPercent || null,
            units: {
                id: model.productUnit || null,
                name: model.unitName || null,
                code: model.unitCode || null
            },
            category: {
                id: model.productCategory || null,
                name: model.categoryName || null,
                code: model.categoryCode || null
            }
        }
    }
}

class PurchaseProductDetailClass {
    constructor(model) {
        model = model || {};
        this.id = model.purchaseProductId || null;
        this.date = model.purchaseProductDate || null;
        this.productId = model.purchaseProductProductId || null;
        this.purchaseOrderId = model.purchaseProductPurchaseOrderId || null;
        this.totalQuantity = model.purchaseProductTotalQuantity || 0;
        this.totalPrice = model.purchaseProductTotalPrice || 0;
        this.totalTax = model.purchaseProductTotalTax || 0;
        this.totalPriceAfterTax = model.purchaseProductTotalPriceAfterTax || 0;
        this.totalDiscountPercent = model.purchaseProductTotalDiscountPercent || null;
        this.totalDiscount = model.purchaseProductTotalDiscount || 0;
        this.transactionId = model.purchaseProducttransactionId || null;
        this.status = model.productStatus || "NEW";
        this.quantityForStockIn = 0;
        this.differenceQuantity = model.purchaseProductDifferenceQuantity || 0;
        this.quantityTaken = model.purchaseProductQuantityTaken || 0;

        this.createdBy = model.purchaseProductCreatedBy || null;
        this.updatedBy = model.purchaseProductUpdatedBy || null;

        this.product = {
            id: model.productId || null,
            thumb: model.productThum || null,
            sku: model.productSku || null,
            name: model.productName || null,
            code: model.productCode || null,
            price: model.productPrice || 0,
            discoundCode: model.productDiscoundCode || null,
            discountPercent: model.productDiscountPercent || null,
            priceAfterDiscount: model.productPriceAfterDiscount || 0,
            tax: model.productTax || 0,
            taxPercent: model.productTaxPercent || null,
            priceWithTax: model.priceWithTax || 0,
            totalPrice: model.productTotalPrice || 0,
            description: model.productDescription,
            brand: model.productBrand || null,
            purchasePrice: model.productPurchasePrice || 0,
            sellingPrice: model.productSellingPrice || 0,
            quantity: model.productQuantity || 0,
            minQuantity: model.productMinQuantity || 0,
            incomingQuantity: model.productIncomingQuantity || 0,
            quantitySold: model.productQuantitySold || 0,
            quantityOut: model.productQuantityOut || 0,
            differenceQuantity: model.productDifferenceQuantity || 0,
            isActive: model.productIsActive == 1 ? true : false || false,
            isFavorite: model.productIsFavorite == 1 ? true : false || false,
            barcode: model.productBarcode || null,
            profitInPercent: model.productProfitInPercent || null,
            units: {
                id: model.productUnit || null,
                name: model.unitName || null,
                code: model.unitCode || null
            },
            category: {
                id: model.productCategory || null,
                name: model.categoryName || null,
                code: model.categoryCode || null
            }
        }
    }
}

class ProductOutClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.productId = model.productId || null;
        this.stockOutId = model.stockOutId || null;
        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalTax = model.totalTax || 0;
        this.totalPriceAfterTax = model.totalPriceAfterTax || 0;
        this.totalDiscountPercent = model.totalDiscountPercent || null;
        this.totalDiscount = model.totalDiscount || 0;
        this.transactionId = model.transactionId || null;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;
    }
}

class PurchaseOrderResults {
    constructor(model, list = new Array()) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.invoiceNumber = model.invoiceNumber || null;
        this.userId = model.userId || null;
        this.supplierId = model.supplierId || null;
        this.totalItem = model.totalItem || 0;

        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalDiscount = model.totalDiscount || 0;
        this.totalPriceAfterDiscount = model.totalPriceAfterDiscount || 0;
        this.totalTax = model.totalTax || 0;
        this.totalPriceWithTax = model.totalPriceWithTax || 0;
        this.adminFee = model.adminFee || 0;
        this.status = model.status || "NEW";

        this.purchaseProduct = list.map((item) => new PurchaseProductDetailClass(item))

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;

    }
}

class StockInDetailResults {
    constructor(model, productIn) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.invoiceNumber = model.invoiceNumber || null;
        this.userId = model.userId || null;
        this.supplierId = model.supplierId || null;
        this.purchaseOrderId = model.purchaseOrderId || null;
        this.totalItem = model.totalItem || 0;
        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalDiscount = model.totalDiscount || null;
        this.totalPriceAfterDiscount = model.totalPriceAfterDiscount || 0;
        this.totalTax = model.totalTax || 0;
        this.totalPriceWithTax = model.totalPriceWithTax || 0;
        this.adminFee = model.adminFee || 0;
        this.receiptType = model.receiptType || "MANUAL";
        this.receiptStatus = model.receiptStatus || "FULL";
        this.status = model.status || "NEW";

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;

        this.productIn = new ProductInDetailList(productIn)
    }
}

class ProductList extends List {
    get model() {
        return ProductClass;
    }
}

class ProductInList extends List {
    get model() {
        return ProductInClass;
    }
}

class ProductOutList extends List {
    get model() {
        return ProductOutClass;
    }
}

class ProductSoldList extends List {
    get model() {
        return ProductSoldClass;
    }
}

class PurchaseProductList extends List {
    get model() {
        return PurchaseProductClass;
    }
}

class ProductInDetailList extends List {
    get model() {
        return ProductInDetailClass;
    }
}

class PurchaseProductDetailList extends List {
    get model() {
        return PurchaseProductDetailClass;
    }
}

module.exports = {
    ProductClass,
    ProductList,
    ProductInList,
    ProductInClass,
    ProductOutList,
    ProductOutClass,
    ProductSoldList,
    ProductSoldClass,
    PurchaseProductList,
    PurchaseProductClass,
    ProductInDetailClass,
    ProductInDetailList,
    PurchaseProductDetailClass,
    PurchaseProductDetailList,
    PurchaseOrderResults,
    StockInDetailResults
};
