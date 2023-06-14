const { List } = require("./list.class");

class TransactionClass {
    constructor(model) {
        model = model || {};
        this.id = model.id || null;
        this.date = model.date || null;
        this.invoiceNumber = model.invoiceNumber || null;
        this.userId = model.userId || null;
        this.customerId = model.customerId || null;
        this.totalItem = model.totalItem || 0;

        this.totalQuantity = model.totalQuantity || 0;
        this.totalPrice = model.totalPrice || 0;
        this.totalDiscount = model.totalDiscount || 0;
        this.totalPriceAfterDiscount = model.totalPriceAfterDiscount || 0;
        this.totalTax = model.totalTax || 0;
        this.totalPriceWithTax = model.totalPriceWithTax || 0;
        this.adminFee = model.adminFee || 0;

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;

    }
}

class PurchaseOrderClass {
    constructor(model) {
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

        this.createdBy = model.createdBy || null;
        this.updatedBy = model.updatedBy || null;
        this.createdAt = model.createdAt || null;
        this.updatedAt = model.updatedAt || null;
        this.deletedAt = model.deletedAt || null;

    }
}

class TransactionList extends List {
    get model() {
        return TransactionClass;
    }
}

class PurchaseOrderList extends List {
    get model() {
        return PurchaseOrderClass;
    }
}

module.exports = {
    TransactionClass,
    TransactionList,
    PurchaseOrderClass,
    PurchaseOrderList
};
