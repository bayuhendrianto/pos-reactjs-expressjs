const express = require("express");
const router = express.Router();
const { Settings, Cronjobs } = require("../models/index.model");
const { SettingClass } = require("../class/index.class");
const { v4: uuid } = require("uuid");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Get Setting
 */
router.get("/get", async (req, res) => {
    try {
        const setting = await Settings.findOne();
        res.status(200).json(new SettingClass(setting))
    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

/**
 * Get Cronjob
 */
router.get("/cronjob", async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const vehicles = await Cronjobs.findAndCountAll({
            order: [["createdAt", "DESC"]],
            where: {
                [Op.or]: [
                    {
                        type: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        purpose: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                ],
            },
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(vehicles, limit);
        res.json(response);
    } catch (error) {
        res.json({ message: "Ërror" });
        console.log(error);
    }
});

router.put('/update-setting', async (req, res) => {
    let setting = req.body;
    try {
        await Settings.update(setting, {
            where: {
                id: setting.id
            }
        });

        res.status(200).json({ message: 'Success' })
    } catch (error) {
        res.status(400).json({ message: 'Error', error: error })
    }
})

/**
 *
 */
router.post("/create-cronjob", async (req, res) => {
    var cronjob = req.body;

    cronjob["id"] = uuid();

    try {
        await Cronjobs.create(cronjob);

        res.status(400).json({ message: "cronjob type added !" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "cronjob added fail !", error: error });
    }
});

router.put('/update-cronjob', async (req, res) => {
    let cronjob = req.body;
    try {
        await Cronjobs.update(cronjob, {
            where: {
                id: cronjob.id
            }
        });

        res.status(200).json({ message: 'Success' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error', error: error })
    }
})

module.exports = router;
