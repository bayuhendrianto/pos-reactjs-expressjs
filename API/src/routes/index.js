const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = require("../middleware/verifytoken");
const {
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
  document,
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
} = require("../controllers/index.controller");

router.use("/users", verifyToken, user);
router.use("/auth", auth);
router.use("/refresh-token", refreshToken);
router.use("/payment", paymentGateway);
router.use("/roles", verifyToken, role);
router.use("/booking", verifyToken, booking);
router.use("/company", verifyToken, company);
router.use("/customer", verifyToken, customer);
router.use("/supplier", verifyToken, supplier);
router.use("/employee", verifyToken, employee);
router.use("/notification", verifyToken, notification);
router.use("/setting", verifyToken, setting);
router.use("/wallet", verifyToken, wallet);
router.use("/category", verifyToken, category);
router.use("/unit", verifyToken, unit);
router.use("/product", verifyToken, product);
// router.use("/stock", verifyToken, stock);
// router.use("/stock-in", verifyToken, stockIn);
// router.use("/stock-out", verifyToken, stockOut);
// router.use("/transaction", verifyToken, transaction);

router.use("/stock", stock);
router.use("/stock-in", stockIn);
router.use("/stock-out", stockOut);
router.use("/transaction", transaction);

router.use("/upload", upload);
router.use("/location", location);

module.exports = router;
