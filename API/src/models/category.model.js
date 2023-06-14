const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const CategoryModel = {
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
    normalizeCode: {
        type: DataTypes.STRING
    },
    normalizeName: {
        type: DataTypes.STRING
    },
    thumb: {
        type: DataTypes.STRING
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const Categories = db.define('categories', CategoryModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Categories
};