const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const StockInModel = {
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
    purchaseOrderId: {
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
    receiptType: {
        type: DataTypes.ENUM("MANUAL", "TAKEFROMPURCHASE")
    },
    receiptStatus: {
        type: DataTypes.ENUM("FULL", "PARTIAL")
    },
    status: {
        type: DataTypes.ENUM("NEW", "ONPROGRESS", "DELIVER", "PENDING", "FINISH", "CLOSE")
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const StockOutModel = {
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
    userId: {
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
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const StockIn = db.define('stock_in', StockInModel, {
    freezeTableName: true,
    paranoid: true
});

const StockOut = db.define('stock_out', StockOutModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    StockIn,
    StockOut
};