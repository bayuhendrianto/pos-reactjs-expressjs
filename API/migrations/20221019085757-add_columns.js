"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "companies", // table name
        "brand", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "subDistrict", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "subDistrictId", // new field name
        {
          type: Sequelize.UUID
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "district", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "districtId", // new field name
        {
          type: Sequelize.UUID
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "cityId", // new field name
        {
          type: Sequelize.UUID
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "provinceId", // new field name
        {
          type: Sequelize.UUID
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "countryId", // new field name
        {
          type: Sequelize.STRING(20)
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "countryName", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "npwp", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "linkedIn", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "facebook", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "twitter", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "instagram", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "tiktok", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      //------------------------------------------------------
      queryInterface.addColumn(
        "users", // table name
        "npwp", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "identityType", // new field name
        {
          type: Sequelize.ENUM("KTP", "SIM", "PASPORT"),
          defaultValue: "KTP"
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "identityNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "userNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "linkedIn", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "facebook", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "twitter", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "instagram", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "tiktok", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      //-------------------------------------------------------------------------------------
      queryInterface.addColumn(
        "employees", // table name
        "npwp", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "identityType", // new field name
        {
          type: Sequelize.ENUM("KTP", "SIM", "PASPORT"),
          defaultValue: "KTP"
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "identityNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "userNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "linkedIn", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "facebook", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "twitter", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "instagram", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "tiktok", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      //-------------------------------------------------------------------------------------
      queryInterface.addColumn(
        "customers", // table name
        "npwp", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "identityType", // new field name
        {
          type: Sequelize.ENUM("KTP", "SIM", "PASPORT"),
          defaultValue: "KTP"
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "identityNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "userNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "linkedIn", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "facebook", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "twitter", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "instagram", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "tiktok", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      //-------------------------------------------------------------------------------------
      queryInterface.addColumn(
        "drivers", // table name
        "npwp", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "identityType", // new field name
        {
          type: Sequelize.ENUM("KTP", "SIM", "PASPORT"),
          defaultValue: "KTP"
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "identityNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "userNumber", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "linkedIn", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "facebook", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "twitter", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "instagram", // new field name
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "tiktok", // new field name
        {
          type: Sequelize.STRING
        }
      ),

      // =====================================
      queryInterface.addColumn(
        "users", // table name
        "countryId", // new field name
        {
          type: Sequelize.STRING(20)
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "countryName", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      // =====================================
      queryInterface.addColumn(
        "customers", // table name
        "countryId", // new field name
        {
          type: Sequelize.STRING(20)
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "countryName", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      // =====================================
      queryInterface.addColumn(
        "drivers", // table name
        "countryId", // new field name
        {
          type: Sequelize.STRING(20)
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "countryName", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      // =====================================
      queryInterface.addColumn(
        "employees", // table name
        "countryId", // new field name
        {
          type: Sequelize.STRING(20)
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "countryName", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      // =================================================
      queryInterface.addColumn(
        "advertisements", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "advertisements", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "bookings", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "bookings", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "car_whell_categories", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "car_whell_categories", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "companies", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "companies", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "insurances", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "insurances", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "item_categories", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "item_categories", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "roles", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "roles", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "styrofoamboxs", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "styrofoamboxs", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "users", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "users", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "customers", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "customers", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "employees", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "employees", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "drivers", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "drivers", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "vehicles", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "vehicles", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "vehicle_body", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "vehicle_body", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "vehicle_brand", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "vehicle_brand", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "vehicle_categories", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "vehicle_categories", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "vehicle_types", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "vehicle_types", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "vouchers", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "vouchers", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
      //=================================================
      queryInterface.addColumn(
        "voucher_claims", // table name
        "createdBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      queryInterface.addColumn(
        "voucher_claims", // table name
        "updatedBy", // new field name
        {
          type: Sequelize.STRING(100)
        }
      ),
      //=================================================
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
