const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const VoucherModel = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING(1000)
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  expiredAt: {
    type: DataTypes.DATE,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.UUID
  },
  updatedBy: {
    type: DataTypes.UUID
  }
};

const VoucherClaimModel = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  claimAt: {
    type: DataTypes.DATEONLY,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  expiredAt: {
    type: DataTypes.DATE,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.UUID
  },
  updatedBy: {
    type: DataTypes.UUID
  }
};

const Vouchers = db.define("vouchers", VoucherModel, {
  freezeTableName: true,
  paranoid: true,
});

const VoucherClaims = db.define("voucher_claims", VoucherClaimModel, {
  freezeTableName: true,
  paranoid: true,
});

(async () => {
  await db.sync();
})();

module.exports = {
  Vouchers,
  VoucherClaims,
};
