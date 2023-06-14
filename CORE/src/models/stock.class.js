import { ProductInDetailClass } from "./product.class";

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

class StockInList {
    constructor(model = new Array()) {
        this.data = model.map(item => new StockInClass(item));
    }
}

class StockOutList {
    constructor(model = new Array()) {
        this.data = model.map(item => new StockOutClass(item));
    }
}

class StockInDetailClass {
    constructor(model) {
        this.stockInDetail = {
            id: model ? model.stockInDetail.id || null : null,
            date: model ? model.stockInDetail.date || null : null,
            invoiceNumber: model ? model.stockInDetail.invoiceNumber || null : null,
            userId: model ? model.stockInDetail.userId || null : null,
            supplierId: model ? model.stockInDetail.supplierId || null : null,
            totalItem: model ? model.stockInDetail.totalItem || 0 : 0,
            totalQuantity: model ? model.stockInDetail.totalQuantity || 0 : 0,
            totalPrice: model ? model.stockInDetail.totalPrice || 0 : 0,
            totalDiscount: model ? model.stockInDetail.totalDiscount || null : null,
            totalPriceAfterDiscount: model ? model.stockInDetail.totalPriceAfterDiscount || 0 : 0,
            totalTax: model ? model.stockInDetail.totalTax || 0 : 0,
            totalPriceWithTax: model ? model.stockInDetail.totalPriceWithTax || 0 : 0,
            adminFee: model ? model.stockInDetail.adminFee || 0 : 0,
            receiptType: model ? model.stockInDetail.receiptType || "MANUAL" : "MANUAL",
            receiptStatus: model ? model.stockInDetail.receiptStatus || "FULL" : "FULL",
            status: model ? model.stockInDetail.status || "NEW" : "NEW",

            createdBy: model ? model.stockInDetail.createdBy || null : null,
            updatedBy: model ? model.stockInDetail.updatedBy || null : null,
            createdAt: model ? model.stockInDetail.createdAt || null : null,
            updatedAt: model ? model.stockInDetail.updatedAt || null : null,
            deletedAt: model ? model.stockInDetail.deletedAt || null : null,
            productIn: model ? model.stockInDetail.productIn.map((item) => new ProductInDetailClass(item)) : new Array()
        }

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
    StockInClass,
    StockInList,
    StockOutClass,
    StockOutList,
    StockInDetailClass
};
