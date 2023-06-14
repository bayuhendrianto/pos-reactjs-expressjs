const Sequelize = require("sequelize")
const db = require("../config/db")

const { DataTypes } = Sequelize;

const bookingModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    no: {
        type: DataTypes.STRING(50)
    },

    // Company
    companyId: {
        type: DataTypes.UUID,
    },
    companyName: { // Company Name
        type: DataTypes.STRING(100)
    },
    companyEmail: { // Company Email
        type: DataTypes.STRING(50)
    },
    companyPhone: { // Company Phone /  Telp
        type: DataTypes.STRING(20)
    },
    companyPhotoUrl: {
        type: DataTypes.STRING
    },

    // Customer
    customerId: {
        type: DataTypes.UUID,
    },
    customerFirstName: {
        type: DataTypes.STRING(50)
    },
    customerLastName: {
        type: DataTypes.STRING(50)
    },
    customerName: {
        type: DataTypes.STRING(50)
    },
    customerEmail: {
        type: DataTypes.STRING(50)
    },
    customerPhone: {
        type: DataTypes.STRING(20)
    },
    customerPhoto: {
        type: DataTypes.STRING(100)
    },
    customerCardNumber: {
        type: DataTypes.STRING(100)
    },


    // Order Info
    orderFrom: {
        type: DataTypes.STRING
    },
    orderFromLatitude: {
        type: DataTypes.STRING
    },
    orderFromLongitude: {
        type: DataTypes.STRING
    },
    orderDestination: {
        type: DataTypes.STRING
    },
    orderDestinationLatitude: {
        type: DataTypes.STRING
    },
    orderDestinationLongitude: {
        type: DataTypes.STRING
    },
    orderPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    orderInsuranceId: {
        type: DataTypes.STRING
    },
    orderInsuranceName: {
        type: DataTypes.STRING
    },
    orderPriceInsurance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    orderPriceInsurancePercent: {
        type: DataTypes.STRING,
    },
    totalOrderPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    discountOrderPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalOrderPriceAfterDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    orderPriceTax: { // e.g 11%
        type: DataTypes.STRING(10)
    },
    totalOrderPriceWithTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    orderStatus: {
        type: DataTypes.ENUM("NEW", "ACCEPT", "PICK", "START", "FINISH", "DELIVER", "CLOSE", "CANCEL", "RETURN"),
        defaultValue: "NEW"
    },
    orderCreateAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
    },
    orderAcceptAt: {
        type: DataTypes.DATE
    },
    orderPickAt: {
        type: DataTypes.DATE
    },
    orderStartAt: {
        type: DataTypes.DATE
    },
    orderFinishAt: {
        type: DataTypes.DATE
    },
    orderDeliverAt: {
        type: DataTypes.DATE
    },
    orderCancelAt: {
        type: DataTypes.DATE
    },
    orderCloseAt: {
        type: DataTypes.DATE
    },
    isOrderAccept: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOrderPick: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOrderStart: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOrderFinish: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOrderDeliver: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOrderCancel: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOrderClose: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    statusItem: {
        type: DataTypes.ENUM("GOOD", "DEFECT", "OTHERS"),
        defaultValue: "OTHERS"
    },
    complaint: {
        type: DataTypes.STRING(1000)
    },
    totalItem: {
        type: DataTypes.INTEGER(4),
        defaultValue: 0
    },
    notes: {
        type: DataTypes.STRING(1000)
    },

    // Payment
    paymentStatus: {
        type: DataTypes.ENUM("none", "pending", "settlement", "deny", "cancel", "expire", "retur")
    },
    paymentWithSaldo: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
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
    autoAcceptedAt: {
        type: DataTypes.DATE
    },
    autoClosedAt: {
        type: DataTypes.DATE
    },

    // Pickup
    pickupAddress: {
        type: DataTypes.STRING(500)
    },
    pickupVillage: {
        type: DataTypes.STRING
    },
    pickupNeighbourhood: {
        type: DataTypes.STRING(10)
    },
    pickupHamlet: {
        type: DataTypes.STRING(10)
    },
    pickupSubDistrict: {
        type: DataTypes.STRING
    },
    pickupDistrict: {
        type: DataTypes.STRING
    },
    pickupCity: {
        type: DataTypes.STRING
    },
    pickupProvince: {
        type: DataTypes.STRING
    },
    pickupPostalCode: {
        type: DataTypes.STRING
    },
    pickupLat: {
        type: DataTypes.STRING
    },
    pickupLng: {
        type: DataTypes.STRING
    },

    // Delivery
    deliveryAddress: {
        type: DataTypes.STRING(500)
    },
    deliveryVillage: {
        type: DataTypes.STRING
    },
    deliveryNeighbourhood: {
        type: DataTypes.STRING(10)
    },
    deliveryHamlet: {
        type: DataTypes.STRING(10)
    },
    deliverySubDistrict: {
        type: DataTypes.STRING
    },
    deliveryDistrict: {
        type: DataTypes.STRING
    },
    deliveryCity: {
        type: DataTypes.STRING
    },
    deliveryProvince: {
        type: DataTypes.STRING
    },
    deliveryPostalCode: {
        type: DataTypes.STRING
    },
    deliveryLat: {
        type: DataTypes.STRING(150)
    },
    deliveryLng: {
        type: DataTypes.STRING(150)
    },
    invoiceNumber: {
        type: DataTypes.STRING
    },
    recipientName: {
        type: DataTypes.STRING
    },
    recipientEmail: {
        type: DataTypes.STRING
    },
    recipientPhoneNumber: {
        type: DataTypes.STRING
    },
    sendEmailBookingCreated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    }
}

const Bookings = db.define('bookings', bookingModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Bookings
};