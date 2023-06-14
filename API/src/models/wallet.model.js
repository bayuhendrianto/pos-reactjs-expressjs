const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const WalletModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalWithdrawal: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    firstCredit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastCredit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    firstDebit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastDebit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    withdrawalByUserId: {
        type: DataTypes.UUID
    },
    withdrawalBy: {
        type: DataTypes.STRING
    },
    withdrawalCreatedAt: {
        type: DataTypes.DATE
    }
}

const IncomeHistoryModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    bookingId: {
        type: DataTypes.UUID
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    adminFee: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalRevenueReceived: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}

const WithdrawalModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    companyName: {
        type: DataTypes.STRING
    },
    totalWithdrawal: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bank: {
        type: DataTypes.STRING(100)
    },
    accountNumber: {
        type: DataTypes.STRING(50)
    },
    status: {
        type: DataTypes.ENUM("pending", "success", "reject")
    },
    notes: {
        type: DataTypes.STRING(1000)
    },
    withdrawalByUserId: {
        type: DataTypes.UUID
    },
    withdrawalBy: {
        type: DataTypes.STRING
    },
    withdrawalCreatedAt: {
        type: DataTypes.DATE
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}

const BankAccountModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    bank: {
        type: DataTypes.STRING(100)
    },
    accountNumber: {
        type: DataTypes.STRING(50)
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}

const Wallets = db.define('wallets', WalletModel, {
    freezeTableName: true,
    paranoid: true
});

const IncomeHistories = db.define('income_histories', IncomeHistoryModel, {
    freezeTableName: true,
    paranoid: true
});

const Withdrawals = db.define('withdrawals', WithdrawalModel, {
    freezeTableName: true,
    paranoid: true
});

const BankAccounts = db.define('bank_account', BankAccountModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Wallets,
    IncomeHistories,
    Withdrawals,
    BankAccounts
};