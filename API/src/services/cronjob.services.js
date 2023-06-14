const dotenv = require("dotenv");
const cron = require("node-cron");
const momentTimezone = require("moment-timezone");
const moment = require("moment");
const db = require("../config/db");
const { v4: uuid } = require("uuid");
dotenv.config();

var nodemailer = require('nodemailer');
const { Op } = require("sequelize");
const { Products, Notifications } = require("../models/index.model");

module.exports = () => {
  /**
   * Cron Job every 5 minutes
   *
   * Cari booking dengan paymentStatus 'none' dan sudah expiry
   * Jika ada data dengan pencarian tersebut, update data booking
   * dan update juga data schedule
   *
   * https://www.npmjs.com/package/node-cron
   * https://crontab.guru/examples.html
   */
  cron.schedule("*/5 * * * *", async () => {
    let now = momentTimezone
      .tz(new Date(), "Asia/Jakarta")
      .format("YYYY-MM-DDTHH:mm:ss");

    try {
      //
    } catch (error) {
      console.log(error);
    }
  });

  /**
   * Cron Job every 00:00:00
   *
   * https://www.npmjs.com/package/node-cron
   * https://crontab.guru/examples.html
   */
  cron.schedule("0 0 * * *", async () => {
    try {
      const products = await Products.findAll({
        order: [["name", "ASC"]],
        where: {
          quantity: {
            [Op.lte]: ['minQuantity']
          }
        }
      });

      if (products.length > 0) {
        let notification = [];
        products.forEach(async (item, index) => {
          notification.push({
            id: uuid(),
            userId: null,
            companyId: null,
            name: "Minimum Stok",
            messages: `Persediaan produk ${item['name']} mencapai nilai minimum ${item['minQuantity']} yaitu ${item['quantity']}`,
            url: null,
            type: "minimum_stock",
            dataId: item['id'],
            photoUrl: null,
            isOpen: false
          })

          if (index === (products.length - 1)) {
            await Notifications.bulkCreate(notification)
          }
        })
      }

    } catch (error) {
      console.log(error);
    }
  });

  /**
   * Cron Job every seconds
   *
   * https://www.npmjs.com/package/node-cron
   * https://crontab.guru/examples.html
   */
  cron.schedule("* * * * * *", async () => {
    let now = momentTimezone
      .tz(new Date(), "Asia/Jakarta")
      .format("YYYY-MM-DD");
    try {

    } catch (error) {
      console.log(error);
    }
  });

  /**
   * Cron Job
   *
   * Every 10 seconds
   * 
   * https://www.npmjs.com/package/node-cron
   * https://crontab.guru/examples.html
   */
  cron.schedule("*/10 * * * * *", async () => {
    let now = momentTimezone
      .tz(new Date(), "Asia/Jakarta")
      .format("YYYY-MM-DD");
    try {

    } catch (error) {
      console.log(error);
    }
  });

  /**
 * Cron Job
 *
 * Every 10 seconds
 * 
 * https://www.npmjs.com/package/node-cron
 * https://crontab.guru/examples.html
 */
  cron.schedule("*/15 * * * * *", async () => {
    try {
      //
    } catch (error) {
      console.log(error);
    }
  });
};