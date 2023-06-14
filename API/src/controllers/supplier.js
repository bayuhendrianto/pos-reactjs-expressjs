const express = require("express");
const router = express.Router();
const { Users, Documents, Suppliers } = require("../models/index.model");
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
        const suppliers = await Suppliers.findAndCountAll({
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
        const response = GetPagingData(suppliers, limit);
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
        const Supplier = await Suppliers.findAndCountAll({
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
        const response = GetPagingData(Supplier, limit);
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
    const supplierId = req.headers["supplierid"];
    if (!supplierId) {
        return res
            .status(404)
            .json({ message: "Supplier Id Not Found in Headers !" });
    }

    try {
        const supplier = await Suppliers.findOne({
            include: ["documents"],
            where: {
                id: supplierId,
            },
        });
        res.json(supplier ? new UserClass(supplier["dataValues"]) : supplier);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
});


router.post("/new", async (req, res) => {
    const _transactionUser = await Users.sequelize.transaction(),
        _transactionSupplier = await Suppliers.sequelize.transaction(),
        _transactionDocument = await Documents.sequelize.transaction();

    var body = req.body;
    var documents = req.body.documents;

    var supplierData = {
        id: uuid(),
        email: body.email,
        password: body.password,
        refresh_token: body.refresh_token,
        photoUrl: body.photoUrl,
        providerId: body.providerId,
        firstSignInAt: body.firstSignInAt,
        lastSignInAt: body.lastSignInAt,
        group: "supplier",
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
        companyId: null,
        companyName: body.companyName,
        cardNumber: body.cardNumber,
        cardType: "silver",
        userNumber: body.userNumber
    };

    const findUserByEmail = await Suppliers.findOne({
        where: {
            email: supplierData.email,
        },
    });

    if (findUserByEmail) {
        return res.status(400).send({
            message: "Supplier with same email is already registered !",
        });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash("pass@12345", salt);
    supplierData.password = hashPassword;

    supplierData.fullName = supplierData.lastName
        ? `${supplierData.firstName} ${supplierData.lastName}`
        : supplierData.firstName;

    try {
        if (supplierData.photoUrl && documents.length > 0) {
            // Jika ada photo dan document
            var uploadPhotoProfile = await UploadPhoto(supplierData.photoUrl, "users");
            supplierData.photoUrl = uploadPhotoProfile.url;

            // Create document Object
            documents.map((item) => {
                item["id"] = uuid();
                item["userId"] = supplierData.id;
                item["supplierId"] = supplierData.id;
            });

            Users.create(supplierData, _transactionUser);
            Suppliers.create(supplierData, _transactionSupplier);
            Documents.bulkCreate(documents, _transactionDocument);

            await Promise.all([
                _transactionUser.commit(),
                _transactionSupplier.commit(),
                _transactionDocument.commit(),
            ]);

            res.status(200).json({ message: "Supplier registered" });
        } else if (supplierData.photoUrl && documents.length == 0) {
            // Jika ada photo dan tidak ada document
            var uploadPhotoProfile = await UploadPhoto(supplierData.photoUrl, "users");

            supplierData.photoUrl = uploadPhotoProfile.url;
            Users.create(supplierData, _transactionUser);
            Suppliers.create(supplierData, _transactionSupplier);

            await Promise.all([
                _transactionUser.commit(),
                _transactionSupplier.commit(),
            ]);

            res.status(200).json({ message: "Supplier registered" });
        } else if (!supplierData.photoUrl && documents.length > 0) {
            // Jika tidak ada photo dan ada document
            documents.map((item) => {
                item["id"] = uuid();
                item["userId"] = supplierData.id;
                item["supplierId"] = supplierData.id;
            });

            Users.create(supplierData, _transactionUser);
            Suppliers.create(supplierData, _transactionSupplier);
            Documents.bulkCreate(documents, _transactionDocument);

            await Promise.all([
                _transactionUser.commit(),
                _transactionSupplier.commit(),
                _transactionDocument.commit(),
            ]);

            res.status(200).json({ message: "Supplier registered" });
        } else {

            // Jika tidak ada photo dan tidak ada document
            Users.create(supplierData, _transactionUser);
            Suppliers.create(supplierData, _transactionSupplier);

            await Promise.all([
                _transactionUser.commit(),
                _transactionSupplier.commit(),
            ]);

            res.status(200).json({ message: "Supplier registered" });
        }
    } catch (error) {
        await Promise.all([
            _transactionUser.rollback(),
            _transactionSupplier.rollback(),
            _transactionDocument.rollback(),
        ]);
        res.status(400).json({ message: "Error" });
    }
});

router.put("/update", async (req, res) => {
    var body = req.body;
    var supplierData = {
        id: body.id,
        email: body.email,
        refresh_token: body.refresh_token,
        photoUrl: body.photoUrl,
        providerId: body.providerId,
        firstSignInAt: body.firstSignInAt,
        lastSignInAt: body.lastSignInAt,
        group: "supplier",
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
        companyId: null,
        companyName: body.companyName,
        status: body.status
    };

    supplierData.fullName = supplierData.lastName
        ? `${supplierData.firstName} ${supplierData.lastName}`
        : supplierData.firstName;

    try {
        let findById = await Suppliers.findByPk(supplierData["id"]);

        if (!findById) {
            return res.status(400).json({ message: "Data not found !" });
        }

        let _supplier = new UserClass(findById);

        if (supplierData.email !== _supplier.email) {

            let findUserByEmail = await Users.findOne({
                where: {
                    email: supplierData.email
                }
            });

            if (findUserByEmail === null) {
                UpdateUser(supplierData).then(() => {
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
            UpdateUser(supplierData).then(() => {
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

    const user = await Suppliers.findOne({
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

    const user = await Suppliers.findOne({
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
    const _transactionSupplier = await Suppliers.sequelize.transaction();
    const _transactionUser = await Users.sequelize.transaction();
    try {
        UploadPhoto(base64image, "users")
            .then(async (response) => {
                const supplier = await Suppliers.findByPk(req.body.id)

                var SupplierData = supplier["dataValues"]
                SupplierData.photoUrl = response.url;

                Suppliers.update(
                    SupplierData,
                    {
                        where: {
                            id: req.body.id,
                        },
                    },
                    _transactionSupplier
                );

                Users.update(
                    SupplierData,
                    {
                        where: {
                            id: req.body.id,
                        },
                    },
                    _transactionUser
                );

                await Promise.all([
                    _transactionSupplier.commit(),
                    _transactionUser.commit(),
                ]);

                res.status(200).json({
                    message: "Upload photo success !",
                    response: response,
                });
            })
            .catch(async (error) => {
                await Promise.all([
                    _transactionSupplier.rollback(),
                    _transactionUser.rollback(),
                ]);
                console.log("Error upload photo :", error);
                res.status(500).json({ message: "Error upload photo", error });
            });
    } catch (error) {
        await Promise.all([
            _transactionSupplier.rollback(),
            _transactionUser.rollback(),
        ]);
        res.status(500).json({ message: "Error upload photo" });
    }
});

module.exports = router;
