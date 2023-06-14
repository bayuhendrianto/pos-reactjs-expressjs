const express = require('express');
const router = express.Router();
const { Documents } = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const db = require("../config/db");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { DocumentClassList } = require('../class/document.class');

/**
 * 
 */
router.get('/core', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);

    search = search ? search : '';

    try {
        const documents = await Documents.findAndCountAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: ['%' + search + '%']
                        }
                    }
                ]
            },
            limit: limit,
            offset: offset
        });

        const response = GetPagingData(documents, limit);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

router.get('/all', async (req, res) => {
    const companyId = req.headers['companyid'];

    if (companyId == null || companyId == undefined) {
        return res.status(404).json('Not found !')
    }

    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);

    search = search ? search : '';

    try {
        const documents = await Documents.findAndCountAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                companyId: companyId,
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: ['%' + search + '%']
                        }
                    }
                ]
            },
            limit: limit,
            offset: offset
        });

        const response = GetPagingData(documents, limit);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

router.get('/get-by-companyId/:companyId', async (req, res) => {
    const { companyId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                companyId: companyId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-vehicleId/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                vehicleId: vehicleId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-userId/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                userId: userId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-employeeId/:employeeId', async (req, res) => {
    const { employeeId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                employeeId: employeeId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-customerId/:customerId', async (req, res) => {
    const { customerId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                customerId: customerId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-driverId/:driverId', async (req, res) => {
    const { driverId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                driverId: driverId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-ratingId/:ratingId', async (req, res) => {
    const { ratingId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                ratingId: ratingId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-bookingId/:bookingId', async (req, res) => {
    const { bookingId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                bookingId: bookingId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-booking-type/:bookingId/:type', async (req, res) => {
    const { bookingId, type } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                bookingId: bookingId,
                bookingType: type
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-booking-status-item/:bookingId/:status', async (req, res) => {
    const { bookingId, status } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                bookingId: bookingId,
                statusItem: status
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

router.get('/get-by-advertisementId/:advertisementId', async (req, res) => {
    const { advertisementId } = req.params;

    try {
        const documents = await Documents.findAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                advertisementId: advertisementId
            }
        });

        res.status(200).json(new DocumentClassList(documents));
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

module.exports = router;