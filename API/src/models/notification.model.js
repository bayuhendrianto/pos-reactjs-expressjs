const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const NotificationModel = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  messages: {
    type: DataTypes.STRING(1000),
  },
  url: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  dataId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  isOpen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

const Notifications = db.define("notifications", NotificationModel, {
  freezeTableName: true,
  paranoid: true,
});

(async () => {
  await db.sync();
})();

module.exports = {
  Notifications,
};
