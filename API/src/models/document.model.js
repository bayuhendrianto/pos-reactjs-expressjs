const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const DocumentModel = {
    // User Info
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100)
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    supplierId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING
    },
    path: {
        type: DataTypes.STRING(50)
    },
    status: {
        type: DataTypes.ENUM('new', 'valid', 'invalid')
    },
    comment: {
        type: DataTypes.STRING(1000)
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    exifData: {
        type: DataTypes.STRING(2000)
    }
}

const Documents = db.define('documents', DocumentModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Documents
};