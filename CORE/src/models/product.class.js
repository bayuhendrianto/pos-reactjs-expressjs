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
        console.log(model)
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.productId = model.productId || null;
        this.stockInId = model.stockInId || null;
        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalTax = model.totalTax || 0;
        this.totalPriceAfterTax = model.totalPriceAfterTax || 0;
        this.totalDiscountPercent = model.totalDiscountPercent || null;
        this.totalDiscount = model.totalDiscount || 0;
        this.transactionId = model.transactionId || null;
        this.status = model.status || "PARTIAL";
        
        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;

        this.product = {
            id: model.product.id || null,
            code: model.product.code || null,
            name: model.product.name || null,
            description: model.product.description || "",
            thumb: model.product.thumb || null,
            sku: model.product.sku || null,
            price: model.product.price || 0,
            discoundCode: model.product.discoundCode || null,
            discountPercent: model.product.discountPercent || null,
            priceAfterDiscount: model.product.priceAfterDiscount || 0,
            taxPercent: model.product.taxPercent || null,
            tax: model.product.tax || 0,
            priceWithTax: model.product.priceWithTax || 0,
            totalPrice: model.product.totalPrice || 0,
            brand: model.product.brand || null,
            purchasePrice: model.product.purchasePrice || 0,
            sellingPrice: model.product.sellingPrice || 0,
            quantity: model.product.quantity || 0,
            minQuantity: model.product.minQuantity || 0,
            incomingQuantity: model.product.incomingQuantity || 0,
            quantitySold: model.product.quantitySold || 0,
            quantityOut: model.product.quantityOut || 0,
            differenceQuantity: model.product.differenceQuantity || 0,
            isActive: model.product.isActive == 1 ? true : false || false,
            isFavorite: model.product.isFavorite == 1 ? true : false || false,
            barcode: model.product.barcode || null,
            profitInPercent: model.product.profitInPercent || null,
            createdBy: model.product.createdBy || null,
            updatedBy: model.product.updatedBy || null,
            units: {
                id: model.product.units.id || null,
                name: model.product.units.name || null,
                code: model.product.units.code || null
            },
            category: {
                id: model.product.category.id || null,
                name: model.product.category.name || null,
                code: model.product.category.name || null
            }
        }
    }
}

class PurchaseProductDetailClass {
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
        this.status = model.status || "NEW";
        this.quantityForStockIn = 0;
        this.totalPriceForStockIn = 0;
        this.sellingPrice = parseInt(model.totalPrice) / parseInt(model.totalQuantity)
        this.differenceQuantity = model.differenceQuantity || 0;
        this.quantityTaken = model.quantityTaken || 0;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;

        this.product = {
            id: model.product.id || null,
            code: model.product.code || null,
            name: model.product.name || null,
            description: model.product.description || "",
            thumb: model.product.thumb || null,
            sku: model.product.sku || null,
            price: model.product.price || 0,
            discoundCode: model.product.discoundCode || null,
            discountPercent: model.product.discountPercent || null,
            priceAfterDiscount: model.product.priceAfterDiscount || 0,
            taxPercent: model.product.taxPercent || null,
            tax: model.product.tax || 0,
            priceWithTax: model.product.priceWithTax || 0,
            totalPrice: model.product.totalPrice || 0,
            brand: model.product.brand || null,
            purchasePrice: model.product.purchasePrice || 0,
            sellingPrice: model.product.sellingPrice || 0,
            quantity: model.product.quantity || 0,
            minQuantity: model.product.minQuantity || 0,
            incomingQuantity: model.product.incomingQuantity || 0,
            quantitySold: model.product.quantitySold || 0,
            quantityOut: model.product.quantityOut || 0,
            differenceQuantity: model.product.differenceQuantity || 0,
            isActive: model.product.isActive == 1 ? true : false || false,
            isFavorite: model.product.isFavorite == 1 ? true : false || false,
            barcode: model.product.barcode || null,
            profitInPercent: model.product.profitInPercent || null,
            createdBy: model.product.createdBy || null,
            updatedBy: model.product.updatedBy || null,
            units: {
                id: model.product.units.id || null,
                name: model.product.units.name || null,
                code: model.product.units.code || null
            },
            category: {
                id: model.product.category.id || null,
                name: model.product.category.name || null,
                code: model.product.category.name || null
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

class ProductList {
    constructor(model = new Array()) {
        this.data = model.map(item => new ProductClass(item));
    }
}

class ProductInList {
    constructor(model = new Array()) {
        this.data = model.map(item => new ProductInClass(item));
    }
}

class ProductOutList {
    constructor(model = new Array()) {
        this.data = model.map(item => new ProductOutClass(item));
    }
}

class ProductSoldList {
    constructor(model = new Array()) {
        this.data = model.map(item => new ProductSoldClass(item));
    }
}

class PurchaseProductList {
    constructor(model = new Array()) {
        this.data = model.map(item => new PurchaseProductClass(item));
    }
}

class ProductInDetailList {
    constructor(model = new Array()) {
        this.data = model.map(item => new ProductInDetailClass(item));
    }
}

class PurchaseProductDetailList {
    constructor(model = new Array()) {
        this.data = model.map(item => new PurchaseProductDetailClass(item));
    }
}


class PurchaseOrderResults {
    constructor(model) {
        this.purchaseOrder = {
            id: model ? model.purchaseOrder.id || null : null,
            date: model ? model.purchaseOrder.date || null : null,
            invoiceNumber: model ? model.purchaseOrder.invoiceNumber || null : null,
            userId: model ? model.purchaseOrder.userId || null : null,
            supplierId: model ? model.purchaseOrder.supplierId || null : null,
            totalItem: model ? model.purchaseOrder.totalItem || 0 : null,

            totalQuantity: model ? model.purchaseOrder.totalQuantity || 0 : null,
            totalPrice: model ? model.purchaseOrder.totalPrice || 0 : null,
            totalDiscount: model ? model.purchaseOrder.totalDiscount || 0 : null,
            totalPriceAfterDiscount: model ? model.purchaseOrder.totalPriceAfterDiscount || 0 : null,
            totalTax: model ? model.purchaseOrder.totalTax || 0 : null,
            totalPriceWithTax: model ? model.purchaseOrder.totalPriceWithTax || 0 : null,
            adminFee: model ? model.purchaseOrder.adminFee || 0 : null,
            status: model ? model.purchaseOrder.status || "NEW" : null,
            createdBy: model ? model.purchaseOrder.createdBy || null : null,
            updatedBy: model ? model.purchaseOrder.updatedBy || null : null,
            createdAt: model ? model.purchaseOrder.createdAt || null : null,
            updatedAt: model ? model.purchaseOrder.updatedAt || null : null,
            deletedAt: model ? model.purchaseOrder.deletedAt || null : null,
            purchaseProduct: model ? model.purchaseOrder.purchaseProduct.map((item) => new PurchaseProductDetailClass(item)) : new Array()
        };
        this.user = {
            id: model ? model.user.id : null,
            firstName: model ? model.user.firstName : null,
            lastName: model ? model.user.lastName : null,
            fullName: model ? model.user.fullName : null,
            phoneNumber: model ? model.user.phoneNumber : null
        };
        this.supplier = {
            id: model ? model.supplier.id : null,
            firstName: model ? model.supplier.firstName : null,
            lastName: model ? model.supplier.lastName : null,
            fullName: model ? model.supplier.fullName : null,
            phoneNumber: model ? model.supplier.phoneNumber : null
        }
    }
}


export {
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
    PurchaseOrderResults
};
