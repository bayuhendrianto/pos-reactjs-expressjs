const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
const { Bookings } = require("../models/booking.model");
dotenv.config();
const moment = require("moment");
const { Booking, User, Company } = require("../class/index.class");
const {
  MidtransNotifications,
  Notifications,
  Customers,
  Companies,
} = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { MidtranNotificationClass } = require("../class/midtrans.class");

const axios = require("axios").default;

router.post("/request", (req, res) => {
  axios({
    url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Basic " +
        Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString("base64"),
      // Above is API server key for the Midtrans account, encoded to base64
    },
    data:
    // Below is the HTTP request body in JSON
    {
      transaction_details: {
        order_id: `${new Date().getTime()}_${req.body.bookingId}`,
        gross_amount: req.body.amount,
      },
      customer_details: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
      },
      item_details: [
        {
          id: req.body.bookingId,
          price: req.body.amount,
          quantity: req.body.quantity,
          name: `${req.body.brand} - ${req.body.type}`,
          category: req.body.bookingCategory,
          merchant_name: req.body.company,
        },
      ],
      expiry: {
        // Custom expiry time for payment
        start_time: moment(new Date())
          .format("YYYY-MM-DD HH:mm:ss +0700")
          .toString(), //  "2018-12-13 18:11:08 +0700",
        unit: "minutes",
        duration: 10,
      },
      enabled_payments: [
        "credit_card",
        //   "cimb_clicks",
        "bca_klikbca",
        "bca_klikpay",
        "bri_epay",
        "echannel",
        "permata_va",
        "bca_va",
        "bni_va",
        "bri_va",
        "other_va",
        //   "gopay",
        "indomaret",
        "alfamart",
        //   "danamon_online",
        //   "akulaku",
        //   "shopeepay",
        //   "kredivo",
        //   "uob_ezpay",
      ],
    },
  })
    .then((response) => {
      res.send({
        status: response.status,
        data: response.data,
      });
    })
    .catch((error) => {
      console.log("Error payment request :", error);
      res.send(error);
    });
});

router.get("/status", (req, res) => {
  const order_id = req.headers["orderid"];
  axios({
    url: `https://api.sandbox.midtrans.com/v2/${order_id}/status`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Basic " +
        Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString("base64"),
      // Above is API server key for the Midtrans account, encoded to base64
    },
    data: {},
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log("Error payment request status :", error);
      res.send(error);
    });
});

router.post("/notifications", async (req, res) => {
  const _transactionBooking = await Bookings.sequelize.transaction(),
    _transactionMidtrans = await MidtransNotifications.sequelize.transaction(),
    _transactionNotification = await Notifications.sequelize.transaction();

  var notification = new MidtranNotificationClass(req.body);

  notification.va_numbers = JSON.stringify(notification.va_numbers);
  notification.payment_amounts = JSON.stringify(notification.payment_amounts);

  notification.id = uuid();
  notification.bookingId = notification.order_id.split("_")[1];

  try {
    var _booking = await Bookings.findByPk(notification.bookingId);
    if (!_booking) {
      return res.status(400).json({ message: "Booking not found !" });
    }

    var bookingData = new Booking(_booking);
    bookingData.paymentStatus = notification.transaction_status;
    bookingData.paymentVaNumbers = notification.va_numbers;
    bookingData.paymentTransactionTime = notification.transaction_time;
    bookingData.paymentType = notification.payment_type;

    if (notification.transaction_status === "settlement") {
      let dateNow = new Date();
      let dateNowForAccepted = new Date(moment().add(60, "minutes").toString());

      bookingData.paymentSettlementAt = new Date(
        Date.UTC(
          dateNow.getFullYear(),
          dateNow.getMonth(),
          dateNow.getDate(),
          dateNow.getHours(),
          dateNow.getMinutes(),
          dateNow.getSeconds()
        )
      );

      bookingData.autoAcceptedAt = new Date(
        Date.UTC(
          dateNowForAccepted.getFullYear(),
          dateNowForAccepted.getMonth(),
          dateNowForAccepted.getDate(),
          dateNowForAccepted.getHours(),
          dateNowForAccepted.getMinutes(),
          dateNowForAccepted.getSeconds()
        )
      );

      let notificationData = [
        {
          id: uuid(),
          userId: bookingData.customerId,
          companyId: null,
          name: "Pembayaran Pesanan",
          messages: `Pesanan anda dengan No.${bookingData.no} berhasil dibayar.`,
          url: null,
          type: "booking",
          dataId: bookingData.id,
          photoUrl: null,
          isOpen: false
        },
        {
          id: uuid(),
          userId: null,
          companyId: bookingData.companyId,
          name: "Pembayaran Pesanan",
          messages: `Pesanan dengan No.${bookingData.no} berhasil dibayar.`,
          url: null,
          type: "booking",
          dataId: bookingData.id,
          photoUrl: null,
          isOpen: false
        },
      ];
      Notifications.bulkCreate(notificationData);
    }

    MidtransNotifications.create(notification);
    Bookings.update(bookingData, {
      where: {
        id: bookingData.id,
      },
    });

    await Promise.all([
      _transactionBooking.commit(),
      _transactionMidtrans.commit(),
      _transactionNotification.commit()
    ]);

    res.status(200).send("Success");
  } catch (error) {
    await Promise.all([
      _transactionBooking.rollback(),
      _transactionMidtrans.rollback(),
      _transactionNotification.rollback(),
    ]);
    res.status(400).json({ message: "Error", error: error });
  }
});

router.get("/callback", async (req, res) => {
  try {
    res.json({
      rawHeader: req.rawHeaders,
      headers: req.headers,
    });
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

module.exports = router;
