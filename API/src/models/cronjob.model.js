const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const CronjobModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING(100)
    },
    purpose: {
        type: DataTypes.STRING(100)
    },
    value: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    everyday: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}

const Cronjobs = db.define('cronjob_settings', CronjobModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Cronjobs
};