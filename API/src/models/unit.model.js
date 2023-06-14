const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const UnitModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const Units = db.define('units', UnitModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Units
};