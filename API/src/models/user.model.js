const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const userModel = {
    // User Info
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(50),
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.STRING(500)
    },
    photoUrl: {
        type: DataTypes.STRING(200),
        defaultValue: "https://storage.dayanatura.com/assets/users/user.png"
    },
    providerId: {
        type: DataTypes.STRING(15),
        defaultValue: "password"
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    documentVerified: {
        type: DataTypes.ENUM("verified", "rejected", "reviewed"),
        defaultValue: "reviewed"
    },
    disable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    firstSignInAt: {
        type: DataTypes.DATE
    },
    lastSignInAt: {
        type: DataTypes.DATE
    },
    group: {
        type: DataTypes.ENUM("employee", "customer", "supplier", "others")
    },
    role: {
        type: DataTypes.STRING(50)
    },
    deviceTokenId: {
        type: DataTypes.STRING
    },

    // Profile
    fullName: {
        type: DataTypes.STRING(50)
    },
    firstName: {
        type: DataTypes.STRING(50)
    },
    lastName: {
        type: DataTypes.STRING(50)
    },
    motherName: {
        type: DataTypes.STRING(50)
    },
    birthDate: {
        type: DataTypes.DATE
    },
    birthPlace: {
        type: DataTypes.STRING(50)
    },
    gender: {
        type: DataTypes.STRING(25)
    },
    religion: {
        type: DataTypes.STRING(25)
    },
    cardNumber: {
        type: DataTypes.STRING(100)
    },
    cardType: {
        type: DataTypes.ENUM("silver", "gold", "platinum"),
        defaultValue: "silver"
    },
    cardRegistrationAt: {
        type: DataTypes.DATE
    },
    cardPointReward: {
        type: DataTypes.STRING(15)
    },
    cardPointReedem: {
        type: DataTypes.STRING(15)
    },
    cardPointBalance: {
        type: DataTypes.STRING(15)
    },
    financeBalance: {
        type: DataTypes.STRING(15)
    },
    financeBalanceLastUsed: {
        type: DataTypes.STRING(15)
    },

    // Contact
    phoneNumber: {
        type: DataTypes.STRING(15)
    },
    phoneNumberVerification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // Location
    address: {
        type: DataTypes.STRING(500)
    },
    subDistrict: {
        type: DataTypes.STRING(150)
    },
    subDistrictId: {
        type: DataTypes.UUID
    },
    district: {
        type: DataTypes.STRING(150)
    },
    districtId: {
        type: DataTypes.UUID
    },
    city: {
        type: DataTypes.STRING(100)
    },
    cityId: {
        type: DataTypes.UUID
    },
    province: {
        type: DataTypes.STRING(100)
    },
    provinceId: {
        type: DataTypes.UUID
    },
    postalCode: {
        type: DataTypes.STRING(100)
    },
    lat: {
        type: DataTypes.STRING(100)
    },
    lng: {
        type: DataTypes.STRING(100)
    },

    totalRating: {
        type: DataTypes.DOUBLE
    },
    transactionFirstAt: {
        type: DataTypes.DATEONLY
    },
    transactionLastAt: {
        type: DataTypes.DATEONLY
    },
    transactionTotal: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    companyId: {
        type: DataTypes.UUID
    },
    companyName: {
        type: DataTypes.STRING
    },

    npwp: {
        type: DataTypes.STRING
    },
    identityType: {
        type: DataTypes.ENUM("KTP", "SIM", "PASPORT"),
        defaultValue: "KTP"
    },
    identityNumber: {
        type: DataTypes.STRING
    },
    userNumber: {
        type: DataTypes.STRING
    },
    linkedIn: {
        type: DataTypes.STRING
    },
    facebook: {
        type: DataTypes.STRING
    },
    twitter: {
        type: DataTypes.STRING
    },
    instagram: {
        type: DataTypes.STRING
    },
    tiktok: {
        type: DataTypes.STRING
    },

    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
    sendEmailRegister: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM("active", "non-active", "suspen"),
        defaultValue: "active"
    }
}

const Users = db.define('users', userModel, {
    freezeTableName: true,
    paranoid: true
});

const Employees = db.define('employees', userModel, {
    freezeTableName: true,
    paranoid: true
});

const Customers = db.define('customers', userModel, {
    freezeTableName: true,
    paranoid: true
});

const Suppliers = db.define('suppliers', userModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Users, Employees, Customers, Suppliers
};