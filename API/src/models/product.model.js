const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const ProductModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    thumb: {
        type: DataTypes.STRING
    },
    sku: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    discoundCode: {
        type: DataTypes.STRING
    },
    discountPercent: {
        type: DataTypes.STRING
    },
    priceAfterDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    taxPercent: {
        type: DataTypes.STRING(10)
    },
    tax: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    priceWithTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    unit: {
        type: DataTypes.UUID
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    description: {
        type: DataTypes.STRING(1000)
    },
    brand: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.UUID
    },
    code: {
        type: DataTypes.STRING
    },
    purchasePrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    sellingPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    minQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    incomingQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    quantitySold: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    quantityOut: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    differenceQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    barcode: {
        type: DataTypes.STRING
    },
    profitInPercent: {
        type: DataTypes.STRING(10)
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const ProductSoldModel = {
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
    productId: {
        type: DataTypes.STRING
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalTax: {
        type: DataTypes.DOUBLE
    },
    totalPriceAfterTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalDiscountPercent: {
        type: DataTypes.STRING
    },
    totalDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    transactionId: {
        type: DataTypes.UUID
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const PurchaseProductModel = {
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
    productId: {
        type: DataTypes.UUID
    },
    purchaseOrderId: {
        type: DataTypes.UUID
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPriceAfterTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalDiscountPercent: {
        type: DataTypes.STRING
    },
    totalDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    transactionId: {
        type: DataTypes.UUID
    },
    quantityTaken: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    differenceQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const ProductInModel = {
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
    productId: {
        type: DataTypes.UUID
    },
    stockInId: {
        type: DataTypes.UUID
    },
    totalQuantity: {
        type: DataTypes.STRING
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPriceAfterTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalDiscountPercent: {
        type: DataTypes.STRING
    },
    totalDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    transactionId: {
        type: DataTypes.UUID
    },
    status: {
        type: DataTypes.ENUM("NEW","PARTIAL", "FULL"),
        defaultValue: "NEW"
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const ProductOutModel = {
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
    productId: {
        type: DataTypes.UUID
    },
    stockOutId: {
        type: DataTypes.UUID
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPriceAfterTax: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalDiscountPercent: {
        type: DataTypes.STRING
    },
    totalDiscount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    transactionId: {
        type: DataTypes.UUID
    },
    notes: {
        type: DataTypes.STRING
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const Products = db.define('products', ProductModel, {
    freezeTableName: true,
    paranoid: true
});

const ProductSold = db.define('product_sold', ProductSoldModel, {
    freezeTableName: true,
    paranoid: true
});

const PurchaseProduct = db.define('purchase_product', PurchaseProductModel, {
    freezeTableName: true,
    paranoid: true
});

const ProductIn = db.define('product_in', ProductInModel, {
    freezeTableName: true,
    paranoid: true
});

const ProductOut = db.define('product_out', ProductOutModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Products,
    ProductSold,
    PurchaseProduct,
    ProductIn,
    ProductOut
};