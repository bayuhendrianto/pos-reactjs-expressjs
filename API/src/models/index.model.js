const { Roles } = require("./role.model");
const { Users, Customers, Employees, Suppliers } = require("./user.model");
const { Bookings } = require("./booking.model");
const { Companies } = require("./company.model");
const { Documents } = require("./document.model");
const { Vouchers, VoucherClaims } = require("./voucher.model");
const { MidtransNotifications } = require("./midtrans.model");
const { Notifications } = require("./notification.model");
const { AuditLogs } = require("./auditlog.model");
const { Cronjobs } = require("./cronjob.model");
const { Settings } = require("./setting.model");
const {
  Wallets,
  IncomeHistories,
  Withdrawals,
  BankAccounts
} = require("./wallet.model");

const { Attendances } = require("./attendance.model")
const { Categories } = require("./category.model")
const { Deposited } = require("./deposited.model")
const {
  Products,
  ProductIn,
  ProductOut,
  ProductSold,
  PurchaseProduct
} = require("./product.model")
const {
  StockIn,
  StockOut
} = require("./stock.model")
const {
  Transactions,
  PurchaseOrders
} = require("./transaction.model")
const { Units } = require("./unit.model")

Companies.hasMany(Documents, { as: "documents" });
Users.hasMany(Documents, { as: "documents" });
Employees.hasMany(Documents, { as: "documents" });
Customers.hasMany(Documents, { as: "documents" });
Suppliers.hasMany(Documents, { as: "documents" });
Bookings.hasMany(Documents, { as: "documents" });

Products.hasMany(ProductIn)
ProductIn.belongsTo(Products)

Documents.belongsTo(Companies, {
  foreignKey: 'companyId'
})

Documents.belongsTo(Users, {
  foreignKey: 'userId'
})

Documents.belongsTo(Employees, {
  foreignKey: 'employeeId'
})

Documents.belongsTo(Suppliers, {
  foreignKey: 'cupplierId'
})

Documents.belongsTo(Customers, {
  foreignKey: 'customerId'
})


module.exports = {
  AuditLogs,
  Roles,
  Users,
  Customers,
  Employees,
  Suppliers,
  Bookings,
  Companies,
  Documents,
  Vouchers,
  VoucherClaims,
  MidtransNotifications,
  Notifications,
  Cronjobs,
  Settings,
  Wallets,
  IncomeHistories,
  Withdrawals,
  BankAccounts,
  Attendances,
  Categories,
  Deposited,
  Products,
  ProductIn,
  ProductOut,
  ProductSold,
  PurchaseProduct,
  StockIn,
  StockOut,
  Transactions,
  PurchaseOrders,
  Units
};



// Custom datatypes
//https://github.com/sequelize/sequelize/issues/5981#issuecomment-1071074403