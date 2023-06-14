const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const CompanyModel = {
    // Info
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100)
    },
    code: {
        type: DataTypes.STRING(100)
    },
    email: {
        type: DataTypes.STRING(100)
    },
    photoUrl: {
        type: DataTypes.STRING(200)
    },
    brand: {
        type: DataTypes.STRING
    },
    npwp: {
        type: DataTypes.STRING
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
    countryId: {
        type: DataTypes.STRING(20)
    },
    countryName: {
        type: DataTypes.STRING(100)
    },

    // Contact
    phoneNumber: {
        type: DataTypes.STRING(15)
    },
    phoneNumberVerification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fax: {
        type: DataTypes.STRING(25)
    },
    officeTelp: {
        type: DataTypes.STRING(25)
    },
    website: {
        type: DataTypes.STRING(25)
    },
    deviceTokenId: {
        type: DataTypes.STRING
    },

    // Informasi tambahan
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
    scheduleMadeBefore: {
        type: DataTypes.STRING(5),
        defaultValue: "3"
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

const Companies = db.define('companies', CompanyModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Companies
};