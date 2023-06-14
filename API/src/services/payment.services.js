const axios = require("axios").default;
const moment = require("moment");

function RequestPayment(data, duration) {
    return new Promise((resolve, reject) => {
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
              order_id: `${new Date().getTime()}_${data.bookingId}`,
              gross_amount: data.amount,
            },
            customer_details: {
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
            },
            item_details: [
              {
                id: data.bookingId,
                price: data.amount,
                quantity: data.quantity,
                name: `${data.brand} - ${data.type}`,
                category: data.bookingCategory,
                merchant_name: data.company,
              },
            ],
            expiry: {
              // Custom expiry time for payment
              start_time: moment(new Date())
                .format("YYYY-MM-DD HH:mm:ss +0700")
                .toString(), //  "2018-12-13 18:11:08 +0700",
              unit: "minutes",
              duration: duration,
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
          resolve({
            status: response.status,
            url: response.data.redirect_url,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  module.exports = {
    RequestPayment
  }