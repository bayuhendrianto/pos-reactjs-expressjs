const express = require("express");
const router = express.Router();
const { Notifications } = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const { NotificationClass } = require("../class/index.class");
const { GetPagination, GetPagingData } = require("../services/util.services");

router.get("/", async (req, res) => {
  var { page, size, search } = req.query;
  const { limit, offset } = GetPagination(page, size);

  try {
    const notificationData = await Notifications.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const response = GetPagingData(notificationData, limit);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.get("/get-by-userId/:userId", async (req, res) => {
  var { page, size, search } = req.query;
  const { limit, offset } = GetPagination(page, size);
  const { userId } = req.params;

  try {
    const notificationData = await Notifications.findAndCountAll({
      order: [["createdAt", "DESC"]],
      where: {
        userId: userId,
      },
      limit: limit,
      offset: offset,
    });

    const response = GetPagingData(notificationData, limit);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.put("/open/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const notification = await Notifications.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found !" });
    }

    let data = new NotificationClass(notification);
    data.isOpen = true;

    await Notifications.update(data, { where: { id: id } });

    res.status(200).json({ message: 'Success' })
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/dateofExpired", async (req, res) => {
  var { page, size, search } = req.query;
  const { limit, offset } = GetPagination(page, size);
  try {
    const notificationData = await Notifications.findAndCountAll({
      order: [["createdAt", "DESC"]],
      where: {
        [Op.and]: [
          {
            type: "dateofExpired"
          },
          {
            isOpen: false
          }
        ]
      },
      limit: limit,
      offset: offset,
    });
    const response = GetPagingData(notificationData, limit);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
})

router.get("/dateofExpiredLatest", async (req, res) => {
  try {
    const notificationData = await Notifications.findOne({
      order: [["createdAt", "DESC"]],
      where: {
        [Op.and]: [
          {
            type: "dateofExpired"
          },
          {
            isOpen: false
          }
        ]
      }
    });
    res.json(notificationData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
})

router.get("/periodicalInspectionValidity", async (req, res) => {
  var { page, size, search } = req.query;
  const { limit, offset } = GetPagination(page, size);
  try {
    const notificationData = await Notifications.findAndCountAll({
      order: [["createdAt", "DESC"]],
      where: {
        [Op.and]: [
          {
            type: "periodicalInspectionValidity"
          },
          {
            isOpen: false
          }
        ]
      },
      limit: limit,
      offset: offset,
    });
    const response = GetPagingData(notificationData, limit);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
})

router.get("/periodicalInspectionValidityLatest", async (req, res) => {
  try {
    const notificationData = await Notifications.findOne({
      order: [["createdAt", "DESC"]],
      where: {
        [Op.and]: [
          {
            type: "periodicalInspectionValidity"
          },
          {
            isOpen: false
          }
        ]
      }
    });
    res.json(notificationData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
})

module.exports = router;
