const express = require('express');
const router = express.Router();
const { Users } = require("../models/index.model");
const { UserList, UserClass } = require("../class/index.class");
const { UpdateUser } = require("../services/user.services");
const { GetPagination, GetPagingData } = require("../services/util.services");

router.get('/', async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = GetPagination(page, size);

    try {
        const users = await Users.findAndCountAll(
            {
                order: [
                    ['fullName', 'ASC']
                ],
                limit: limit,
                offset: offset
            }
        );

        const response = GetPagingData(users, limit);
        response.result = new UserList(response.result)
        res.json(response);

    } catch (error) {
        console.log(error);
    }
});

/**
 * Get User By Id
 */
router.get('/get-by-id', async (req, res) => {
    const userId = req.headers['userid'];
    if (!userId) {
        return res.status(404).json({ message: "User Id Not Found in Headers !" })
    }

    try {
        const user = await Users.findOne({
            where: {
                id: userId
            }
        });
        res.json(user ? new UserClass(user['dataValues']) : user);
    } catch (error) {
        console.log(error);
    }
});

/**
 * Update User
 */
router.put('/update', async (req, res) => {
    var body = req.body;
    const userId = body.id;
    var userData = {
        id: userId,
        email: body.email,
        refresh_token: body.refresh_token,
        photoUrl: body.photoUrl,
        providerId: body.providerId,
        firstSignInAt: body.firstSignInAt,
        lastSignInAt: body.lastSignInAt,
        group: body.group,
        role: body.role,
        deviceTokenId: body.deviceTokenId,
        fullName: body.fullName,
        firstName: body.firstName,
        lastName: body.lastName,
        motherName: body.motherName,
        birthDate: body.birthDate,
        birthPlace: body.birthPlace,
        gender: body.gender,
        religion: body.religion,
        phoneNumber: body.phoneNumber,
        address: body.address,
        subDistrict: body.subDistrict,
        subDistrictId: body.subDistrictId,
        district: body.district,
        districtId: body.districtId,
        city: body.city,
        cityId: body.cityId,
        province: body.province,
        provinceId: body.provinceId,
        postalCode: body.postalCode,
        lat: body.lat,
        lng: body.lng,
        companyId: body.companyId
    }

    userData.fullName = userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.firstName;

    try {
        UpdateUser(userData)
            .then(() => {
                res.status(200).json({
                    message: "Update success !"
                })
            });
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
});

router.post('/disable', async (req, res) => {
    var id = req.body.id;

    const user = await Users.findOne({
        where: {
            id: id
        }
    });

    if (!user) {
        res.json({
            message: "User not found!"
        })
    }

    const userData = {
        id: id,
        disable: true,
        group: user['dataValues'].group
    };

    try {
        UpdateUser(userData)
            .then(() => {
                res.status(200).json({
                    message: "Success !"
                })
            }).catch(() => {
                res.status(400).json({
                    message: "Error"
                })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error"
        })
    }
});

router.post('/enable', async (req, res) => {
    var id = req.body.id;

    const user = await Users.findOne({
        where: {
            id: id
        }
    });

    if (!user) {
        res.json({
            message: "User not found!"
        })
    }

    const userData = {
        id: id,
        disable: false,
        group: user['dataValues'].group
    };

    try {
        UpdateUser(userData)
            .then(() => {
                res.status(200).json({
                    message: "Success !"
                })
            }).catch(() => {
                res.status(400).json({
                    message: "Error"
                })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error"
        })
    }
})

module.exports = router;