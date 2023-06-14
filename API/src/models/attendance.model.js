const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const AttendanceModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE
    },
    workshiftTimeIn: {
        type: DataTypes.STRING
    },
    workshiftTimeOut: {
        type: DataTypes.STRING
    },
    dateTimeIn: {
        type: DataTypes.DATE
    },
    latIn: {
        type: DataTypes.STRING
    },
    lngIn: {
        type: DataTypes.STRING
    },
    locationIn: {
        type: DataTypes.STRING
    },
    timezoneInfoIn: {
        type: DataTypes.STRING
    },
    timezoneOffsetIn: {
        type: DataTypes.STRING
    },
    selfiePhotoIn: {
        type: DataTypes.STRING
    },
    deviceIdIn: {
        type: DataTypes.STRING
    },
    dateTimeOut: {
        type: DataTypes.DATE
    },
    latOut: {
        type: DataTypes.STRING
    },
    lngOut: {
        type: DataTypes.STRING
    },
    locationOut: {
        type: DataTypes.STRING
    },
    timezoneInfoOut: {
        type: DataTypes.STRING
    },
    timezoneOffsetOut: {
        type: DataTypes.STRING
    },
    selfiePhotoOut: {
        type: DataTypes.STRING
    },
    deviceIdOut: {
        type: DataTypes.STRING
    },
    isHoliday: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isLeave: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isLate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lateLong: {
        type: DataTypes.INTEGER
    },
    isOvertime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isHomeEarly: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOutOffice: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userId: {
        type: DataTypes.UUID
    },
    rfId: {
        type: DataTypes.STRING
    },
    createdBy: {
        type: DataTypes.UUID
    },
    updatedBy: {
        type: DataTypes.UUID
    },
}

const Attendances = db.define('attendances', AttendanceModel, {
    freezeTableName: true,
    paranoid: true
});

(async () => {
    await db.sync();
})();

module.exports = {
    Attendances
};