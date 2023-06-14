const auth = require("./auth");
const booking = require("./booking");
const company = require("./company");
const customer = require("./customer");
const supplier = require("./supplier");
const employee = require("./employee");
const paymentGateway = require("./paymentgateway");
const refreshToken = require("./refreshtoken");
const role = require("./role");
const user = require("./user");
const notification = require('./notification');
const setting = require('./setting');
const wallet = require('./wallet');
const category = require("./category")
const unit = require("./unit")
const product = require("./product")

const stock = require("./stock")
const stockIn = require("./stockIn")
const stockOut = require("./stockOut")
const transaction = require("./transaction")

const upload = require("./upload")
const location = require("./location")

module.exports = {
    auth,
    booking,
    company,
    customer,
    supplier,
    employee,
    paymentGateway,
    refreshToken,
    role,
    user,
    notification,
    setting,
    wallet,
    category,
    unit,
    product,
    stock,
    stockIn,
    stockOut,
    transaction,
    upload,
    location
}