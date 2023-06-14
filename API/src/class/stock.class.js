const { List } = require("./list.class");

class StockInClass {
    constructor(model) {
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

    }
}

class StockOutClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.userId = model.userId || null;
        this.totalItem = model.totalItem || 0;
        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;

    }
}

class StockInList extends List {
    get model() {
        return StockInClass;
    }
}

class StockOutList extends List {
    get model() {
        return StockOutClass;
    }
}

module.exports = {
    StockInClass,
    StockInList,
    StockOutClass,
    StockOutList
};
