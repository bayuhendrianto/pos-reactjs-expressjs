const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const SettingModel = {
    // Info
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },

    // Company
    companyId: {
        type: DataTypes.UUID,
        allowNull: true,
    },

    adminFeeServices: {
        type: DataTypes.STRING(50)
    },
    adminFeeServicesPercent: {
        type: DataTypes.STRING(50)
    },
    adminFeeInsurance: {
        type: DataTypes.STRING(50)
    },
    adminFeeInsurancePercent: {
        type: DataTypes.STRING(50)
    },
    premiInsurance: {
        type: DataTypes.STRING(50)
    },
    premiInsurancePercent: {
        type: DataTypes.STRING(50)
    },
    costPerKilometer: {
        type: DataTypes.STRING(50)
    },
    paymentPeriodExpired: {
        type: DataTypes.INTEGER
    },

    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    }
}

const Settings = db.define('settings', SettingModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Settings
};