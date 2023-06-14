const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const DepositedModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    no: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
    },
    userId: {
        type: DataTypes.UUID
    },
    total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    notes: {
        type: DataTypes.STRING(1000)
    },
    isClose: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    closeDate: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.ENUM("none", "pending", "settlement", "deny", "cancel", "expire", "retur")
    },
    paymentVaNumbers: {
        type: DataTypes.STRING(1000)
    },
    paymentTransactionTime: {
        type: DataTypes.STRING
    },
    paymentType: {
        type: DataTypes.STRING
    },
    paymentGatewayUrl: {
        type: DataTypes.STRING
    },
    paymentExpiry: {
        type: DataTypes.DATE
    },
    paymentSettlementAt: {
        type: DataTypes.DATE
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const Deposited = db.define('deposited', DepositedModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Deposited
};