const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const AuditLogModel = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50)
    },
    createdBy: {
        type: DataTypes.UUID
    },
    action: {
        type: DataTypes.CHAR(15)
    },
    entityNew: {
        type: DataTypes.TEXT,
    },
    entityOld: {
        type: DataTypes.TEXT
    },
    companyId: {
        type: DataTypes.UUID
    }
}

const AuditLogs = db.define('audit_logs', AuditLogModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    AuditLogs
};