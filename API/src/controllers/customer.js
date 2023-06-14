const express = require("express");
const router = express.Router();
const { Users, Documents, Customers } = require("../models/index.model");
const { UserList, UserClass } = require("../class/index.class");
const { UpdateUser, UploadPhoto } = require("../services/user.services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { GetPagination, GetPagingData } = require("../services/util.services");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const { randomNumbersLetters } = require("../middleware/util");
dotenv.config();

router.get("/", async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const customers = await Customers.findAndCountAll({
            order: [["fullName", "ASC"]],
            where: {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        lastName: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        fullName: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        email: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        phoneNumber: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        cardNumber: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                ],
            },
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(customers, limit);
        response.result = new UserList(response.result);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/active", async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : "";

    try {
        const customer = await Customers.findAndCountAll({
            order: [["fullName", "ASC"]],
            where: {
                status: 'active',
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        lastName: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        fullName: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        email: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    },
                    {
                        phoneNumber: {
                            [Op.like]: ["%" + search + "%"],
                        },
                    }
                ],
            },
            limit: limit,
            offset: offset,
        });
        const response = GetPagingData(customer, limit);
        response.result = new UserList(response.result);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
});

/**
 * Get User By Id
 */
router.get("/get-by-id", async (req, res) => {
    const customerId = req.headers["customerid"];
    if (!customerId) {
        return res
            .status(404)
            .json({ message: "Customer Id Not Found in Headers !" });
    }

    try {
        const customer = await Customers.findOne({
            include: ["documents"],
            where: {
                id: customerId,
            },
        });
        res.json(customer ? new UserClass(customer["dataValues"]) : customer);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
});


router.post("/new", async (req, res) => {
    const _transactionUser = await Users.sequelize.transaction(),
        _transactionCustomer = await Customers.sequelize.transaction(),
        _transactionDocument = await Documents.sequelize.transaction();

    var body = req.body;
    var documents = req.body.documents;

    var customerData = {
        id: uuid(),
        email: body.email,
        password: body.password,
        refresh_token: body.refresh_token,
        photoUrl: body.photoUrl,
        providerId: body.providerId,
        firstSignInAt: body.firstSignInAt,
        lastSignInAt: body.lastSignInAt,
        group: "customer",
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
        companyId: body.companyId,
        cardNumber: body.cardNumber,
        cardType: "silver",
        userNumber: `${randomNumbersLetters(7)}${new Date().getTime().toString().slice(5)}`
    };

    const findUserByEmail = await Customers.findOne({
        where: {
            email: customerData.email,
        },
    });

    if (findUserByEmail) {
        return res.status(400).send({
            message: "Customer with same email is already registered !",
        });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash("pass@12345", salt);
    customerData.password = hashPassword;

    customerData.fullName = customerData.lastName
        ? `${customerData.firstName} ${customerData.lastName}`
        : customerData.firstName;

    try {
        if (customerData.photoUrl && documents.length > 0) {
            // Jika ada photo dan document
            var uploadPhotoProfile = await UploadPhoto(customerData.photoUrl, "users");
            customerData.photoUrl = uploadPhotoProfile.url;

            // Create document Object
            documents.map((item) => {
                item["id"] = uuid();
                item["userId"] = customerData.id;
                item["customerId"] = customerData.id;
            });

            Users.create(customerData, _transactionUser);
            Customers.create(customerData, _transactionCustomer);
            Documents.bulkCreate(documents, _transactionDocument);

            await Promise.all([
                _transactionUser.commit(),
                _transactionCustomer.commit(),
                _transactionDocument.commit(),
            ]);

            res.status(200).json({ message: "customer registered" });
        } else if (customerData.photoUrl && documents.length == 0) {
            // Jika ada photo dan tidak ada document
            var uploadPhotoProfile = await UploadPhoto(customerData.photoUrl, "users");

            customerData.photoUrl = uploadPhotoProfile.url;
            Users.create(customerData, _transactionUser);
            Customers.create(customerData, _transactionCustomer);

            await Promise.all([
                _transactionUser.commit(),
                _transactionCustomer.commit(),
            ]);

            res.status(200).json({ message: "customer registered" });
        } else if (!customerData.photoUrl && documents.length > 0) {
            // Jika tidak ada photo dan ada document
            documents.map((item) => {
                item["id"] = uuid();
                item["userId"] = customerData.id;
                item["customerId"] = customerData.id;
            });

            Users.create(customerData, _transactionUser);
            Customers.create(customerData, _transactionCustomer);
            Documents.bulkCreate(documents, _transactionDocument);

            await Promise.all([
                _transactionUser.commit(),
                _transactionCustomer.commit(),
                _transactionDocument.commit(),
            ]);

            res.status(200).json({ message: "customer registered" });
        } else {

            // Jika tidak ada photo dan tidak ada document
            Users.create(customerData, _transactionUser);
            Customers.create(customerData, _transactionCustomer);

            await Promise.all([
                _transactionUser.commit(),
                _transactionCustomer.commit(),
            ]);

            res.status(200).json({ message: "customer registered" });
        }
    } catch (error) {
        await Promise.all([
            _transactionUser.rollback(),
            _transactionCustomer.rollback(),
            _transactionDocument.rollback(),
        ]);
        res.status(400).json({ message: "Error" });
    }
});

router.put("/update", async (req, res) => {
    var body = req.body;
    var customerData = {
        id: body.id,
        email: body.email,
        refresh_token: body.refresh_token,
        photoUrl: body.photoUrl,
        providerId: body.providerId,
        firstSignInAt: body.firstSignInAt,
        lastSignInAt: body.lastSignInAt,
        group: "customer",
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
        companyId: body.companyId,
        status: body.status
    };

    customerData.fullName = customerData.lastName
        ? `${customerData.firstName} ${customerData.lastName}`
        : customerData.firstName;

    try {
        let findById = await Customers.findByPk(customerData["id"]);

        if (!findById) {
            return res.status(400).json({ message: "Data not found !" });
        }

        let _customer = new UserClass(findById);

        if (customerData.email !== _customer.email) {

            let findUserByEmail = await Users.findOne({
                where: {
                    email: customerData.email
                }
            });

            if (findUserByEmail === null) {
                UpdateUser(customerData).then(() => {
                    res.status(200).json({
                        message: "Update success !",
                    });
                }).catch((error) => {
                    res.status(400).json({ message: 'Error', error: error })
                })
            } else {
                res.status(400).json({ message: 'User with same email is already exist !' })
            }
        } else {
            UpdateUser(customerData).then(() => {
                res.status(200).json({
                    message: "Update success !",
                });
            }).catch((error) => {
                res.status(400).json({ message: 'Error', error: error })
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error', error: error })
    }
});

router.post("/disable", async (req, res) => {
    var id = req.body.id;

    const user = await Customers.findOne({
        where: {
            id: id,
        },
    });

    if (!user) {
        res.json({
            message: "User not found!",
        });
    }

    const userData = {
        id: id,
        disable: true,
        group: user["dataValues"].group,
    };

    try {
        UpdateUser(userData)
            .then(() => {
                res.status(200).json({
                    message: "Success !",
                });
            })
            .catch(() => {
                res.status(400).json({
                    message: "Error",
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error",
        });
    }
});

router.post("/enable", async (req, res) => {
    var id = req.body.id;

    const user = await Customers.findOne({
        where: {
            id: id,
        },
    });

    if (!user) {
        res.json({
            message: "User not found!",
        });
    }

    const userData = {
        id: id,
        disable: false,
        group: user["dataValues"].group,
    };

    try {
        UpdateUser(userData)
            .then(() => {
                res.status(200).json({
                    message: "Success !",
                });
            })
            .catch(() => {
                res.status(400).json({
                    message: "Error",
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error",
        });
    }
});

router.post("/upload-photo", async (req, res) => {
    var base64image = req.body.base64image;
    const _transactionCustomer = await Customers.sequelize.transaction();
    const _transactionUser = await Users.sequelize.transaction();

    console.log(req.body)
    try {
        UploadPhoto(base64image, "users")
            .then(async (response) => {
                const customer = await Customers.findByPk(req.body.id)

                var customerData = customer["dataValues"]
                customerData.photoUrl = response.url;

                Customers.update(
                    customerData,
                    {
                        where: {
                            id: req.body.id,
                        },
                    },
                    _transactionCustomer
                );

                Users.update(
                    customerData,
                    {
                        where: {
                            id: req.body.id,
                        },
                    },
                    _transactionUser
                );

                await Promise.all([
                    _transactionCustomer.commit(),
                    _transactionUser.commit(),
                ]);

                res.status(200).json({
                    message: "Upload photo success !",
                    response: response,
                });
            })
            .catch(async (error) => {
                await Promise.all([
                    _transactionCustomer.rollback(),
                    _transactionUser.rollback(),
                ]);
                console.log("Error upload photo :", error);
                res.status(500).json({ message: "Error upload photo", error });
            });
    } catch (error) {
        await Promise.all([
            _transactionCustomer.rollback(),
            _transactionUser.rollback(),
        ]);
        res.status(500).json({ message: "Error upload photo" });
    }
});

module.exports = router;
