const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const MidtransModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    bookingId: {
        type: DataTypes.STRING
    },
    transaction_time: {
        type: DataTypes.STRING
    },
    transaction_status: {
        type: DataTypes.STRING
    },
    transaction_id: {
        type: DataTypes.STRING
    },
    status_message: {
        type: DataTypes.STRING
    },
    status_code: {
        type: DataTypes.STRING
    },
    signature_key: {
        type: DataTypes.STRING
    },
    payment_type: {
        type: DataTypes.STRING
    },
    order_id: {
        type: DataTypes.STRING
    },
    merchant_id: {
        type: DataTypes.STRING
    },
    masked_card: {
        type: DataTypes.STRING
    },
    gross_amount: {
        type: DataTypes.STRING
    },
    fraud_status: {
        type: DataTypes.STRING
    },
    eci: {
        type: DataTypes.STRING
    },
    currency: {
        type: DataTypes.STRING
    },
    channel_response_message: {
        type: DataTypes.STRING
    },
    channel_response_code: {
        type: DataTypes.STRING
    },
    card_type: {
        type: DataTypes.STRING
    },
    bank: {
        type: DataTypes.STRING
    },
    approval_code: {
        type: DataTypes.STRING
    },
    settlement_time: {
        type: DataTypes.STRING
    },
    transaction_type: {
        type: DataTypes.STRING
    },
    issuer: {
        type: DataTypes.STRING
    },
    acquirer: {
        type: DataTypes.STRING
    },
    permata_va_number: {
        type: DataTypes.STRING
    },
    va_numbers: {
        type: DataTypes.STRING
    },
    payment_amounts: {
        type: DataTypes.STRING
    },
    biller_code: {
        type: DataTypes.STRING
    },
    bill_key: {
        type: DataTypes.STRING
    },
    store: {
        type: DataTypes.STRING
    }
}

const MidtransNotifications = db.define('midtrans_notification', MidtransModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    MidtransNotifications
};