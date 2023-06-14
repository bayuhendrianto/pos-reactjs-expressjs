const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const TransactionModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
    },
    invoiceNumber: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.UUID
    },
    customerId: {
        type: DataTypes.UUID
    },
    totalItem: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPriceAfterDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPriceWithTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    adminFee: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const PurchaseOrderModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
    },
    invoiceNumber: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.UUID
    },
    supplierId: {
        type: DataTypes.UUID
    },
    totalItem: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPriceAfterDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPriceWithTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    adminFee: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM("NEW", "ONPROGRESS", "DELIVER", "PENDING", "FINISH", "CLOSE"),
        defaultValue: "NEW"
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const Transactions = db.define('transactions', TransactionModel, {
    freezeTableName: true,
    paranoid: true
});

const PurchaseOrders = db.define('purchase_order', PurchaseOrderModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Transactions,
    PurchaseOrders
};