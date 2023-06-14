'use strict';
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash('pass@12345', salt);
    return Promise.all([
      queryInterface.bulkInsert('companies', [
        {
          id: '120eYh21-278a-4063-b0n3-yaHg68ff3abX',
          name: 'CV. Brother Casual',
          email: 'info@brothercasual.com',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]),
      queryInterface.bulkInsert('users', [
        {
          id: '900e8757-658a-4163-b183-c9bd68ff3abX',
          firstName: 'Super Admin',
          fullName: 'Super Admin',
          email: 'superadmin@brothercasual.com',
          password: hashPassword,
          group: 'employee',
          phoneNumber: '+62812341234',
          role: '990e8721-658a-4163-b083-c88u68ff3abX',
          companyId: '120eYh21-278a-4063-b0n3-yaHg68ff3abX',
          photoUrl: 'http://localhost:3000/assets/user.png',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]),
      queryInterface.bulkInsert('employees', [
        {
          id: '900e8757-658a-4163-b183-c9bd68ff3abX',
          firstName: 'Super Admin',
          fullName: 'Super Admin',
          email: 'superadmin@brothercasual.com',
          password: hashPassword,
          group: 'employee',
          phoneNumber: '+62812341234',
          role: '990e8721-658a-4163-b083-c88u68ff3abX',
          companyId: '120eYh21-278a-4063-b0n3-yaHg68ff3abX',
          photoUrl: 'http://localhost:3000/assets/user.png',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]),
      queryInterface.bulkInsert('roles', [
        {
          id: '990e8721-658a-4163-b083-c88u68ff3abX',
          name: 'SUPERADMIN',
          description: 'Super Admin',
          isDefault: false,
          isActive: true,
          companyId: '120eYh21-278a-4063-b0n3-yaHg68ff3abX',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: `[{"permissionName":"Company","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":true,"permissionRole":true},{"permissionName":"Employee","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":true,"permissionStatus":true},{"permissionName":"Supplier","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Customer","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false},{"permissionName":"Booking","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false},{"permissionName":"Wallet","permissionView":true,"permissionCreate":false,"permissionEdit":false,"permissionDelete":false,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"BankAccount","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Income","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Withdrawal","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Role","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false},{"permissionName":"Category","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Unit","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Cashier","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Transaction Summary","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Stock","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Stock In","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Stock Out","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Add Stock","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false},{"permissionName":"Products","permissionView":true,"permissionCreate":true,"permissionEdit":true,"permissionDelete":true,"permissionPartnerEdit":false,"permissionRole":false,"permissionStatus":false}]`
        }
      ]),
      queryInterface.bulkInsert('settings', [
        {
          "id": "021ed395-a357-4b38-86ce-d7424447a105",
          "companyId": "120eYh21-278a-4063-b0n3-yaHg68ff3abX",
          "adminFeeServices": "100000",
          "adminFeeServicesPercent": "6",
          "adminFeeInsurance": "Rp 10,000",
          "adminFeeInsurancePercent": "3",
          "premiInsurance": "100000",
          "premiInsurancePercent": "6",
          "paymentPeriodExpired": "30",
          "createdBy": "900e8757-658a-4163-b183-c9bd68ff3abX",
          "updatedBy": "900e8757-658a-4163-b183-c9bd68ff3abX",
          "deletedAt": null
        }
      ]),
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
