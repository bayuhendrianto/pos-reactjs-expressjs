const express = require("express");
const router = express.Router();
const { Users, Documents, Employees, Roles } = require("../models/index.model");
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
        const employees = await Employees.findAndCountAll({
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
        const response = GetPagingData(employees, limit);
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
        const employee = await Employees.findAndCountAll({
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
        const response = GetPagingData(employee, limit);
        response.result = new UserList(response.result);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "Ërror" });
        console.log(error);
    }
});

router.get("/get-by-id", async (req, res) => {
    const employeeId = req.headers["employeeid"];
    if (!employeeId) {
      return res.status(404).json({ message: "User Id Not Found in Headers !" });
    }
  
    var role = null;
    try {
      const employee = await Employees.findOne({
        include: ["documents"],
        where: {
          id: employeeId,
        },
      });
      if (employee) {
        if (employee["dataValues"].role) {
          role = await Roles.findOne({
            where: {
              id: employee["dataValues"].role,
            },
          });
        }
      }
      res.json({
        user: employee ? new UserClass(employee["dataValues"]) : employee,
        role: role
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error', error: error })
    }
  });


router.post("/new", async (req, res) => {
    const _transactionUser = await Users.sequelize.transaction(),
        _transactionEmployee = await Employees.sequelize.transaction(),
        _transactionDocument = await Documents.sequelize.transaction();

    var body = req.body;
    var documents = req.body.documents;

    var employeeData = {
        id: uuid(),
        email: body.email,
        password: body.password,
        refresh_token: body.refresh_token,
        photoUrl: body.photoUrl,
        providerId: body.providerId,
        firstSignInAt: body.firstSignInAt,
        lastSignInAt: body.lastSignInAt,
        group: "employee",
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
        userNumber: body.userNumber
    };

    const findUserByEmail = await Employees.findOne({
        where: {
            email: employeeData.email,
        },
    });

    if (findUserByEmail) {
        return res.status(400).send({
            message: "Employee with same email is already registered !",
        });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash("pass@12345", salt);
    employeeData.password = hashPassword;

    employeeData.fullName = employeeData.lastName
        ? `${employeeData.firstName} ${employeeData.lastName}`
        : employeeData.firstName;

    try {
        if (employeeData.photoUrl && documents.length > 0) {
            // Jika ada photo dan document
            var uploadPhotoProfile = await UploadPhoto(employeeData.photoUrl, "users");
            employeeData.photoUrl = uploadPhotoProfile.url;

            // Create document Object
            documents.map((item) => {
                item["id"] = uuid();
                item["userId"] = employeeData.id;
                item["employeeId"] = employeeData.id;
            });

            Users.create(employeeData, _transactionUser);
            Employees.create(employeeData, _transactionEmployee);
            Documents.bulkCreate(documents, _transactionDocument);

            await Promise.all([
                _transactionUser.commit(),
                _transactionEmployee.commit(),
                _transactionDocument.commit(),
            ]);

            res.status(200).json({ message: "Employee registered" });
        } else if (employeeData.photoUrl && documents.length == 0) {
            // Jika ada photo dan tidak ada document
            var uploadPhotoProfile = await UploadPhoto(employeeData.photoUrl, "users");

            employeeData.photoUrl = uploadPhotoProfile.url;
            Users.create(employeeData, _transactionUser);
            Employees.create(employeeData, _transactionEmployee);

            await Promise.all([
                _transactionUser.commit(),
                _transactionEmployee.commit(),
            ]);

            res.status(200).json({ message: "Employee registered" });
        } else if (!employeeData.photoUrl && documents.length > 0) {
            // Jika tidak ada photo dan ada document
            documents.map((item) => {
                item["id"] = uuid();
                item["userId"] = employeeData.id;
                item["employeeId"] = employeeData.id;
            });

            Users.create(employeeData, _transactionUser);
            Employees.create(employeeData, _transactionEmployee);
            Documents.bulkCreate(documents, _transactionDocument);

            await Promise.all([
                _transactionUser.commit(),
                _transactionEmployee.commit(),
                _transactionDocument.commit(),
            ]);

            res.status(200).json({ message: "Employee registered" });
        } else {

            // Jika tidak ada photo dan tidak ada document
            Users.create(employeeData, _transactionUser);
            Employees.create(employeeData, _transactionEmployee);

            await Promise.all([
                _transactionUser.commit(),
                _transactionEmployee.commit(),
            ]);

            res.status(200).json({ message: "Employee registered" });
        }
    } catch (error) {
        await Promise.all([
            _transactionUser.rollback(),
            _transactionEmployee.rollback(),
            _transactionDocument.rollback(),
        ]);
        res.status(400).json({ message: "Error" });
    }
});

router.put("/update", async (req, res) => {
    var body = req.body;
    var employeeData = {
        id: body.id,
        email: body.email,
        refresh_token: body.refresh_token,
        photoUrl: body.photoUrl,
        providerId: body.providerId,
        firstSignInAt: body.firstSignInAt,
        lastSignInAt: body.lastSignInAt,
        group: "employee",
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

    employeeData.fullName = employeeData.lastName
        ? `${employeeData.firstName} ${employeeData.lastName}`
        : employeeData.firstName;

    try {
        let findById = await Employees.findByPk(employeeData["id"]);

        if (!findById) {
            return res.status(400).json({ message: "Data not found !" });
        }

        let _employee = new UserClass(findById);

        if (employeeData.email !== _employee.email) {

            let findUserByEmail = await Users.findOne({
                where: {
                    email: employeeData.email
                }
            });

            if (findUserByEmail === null) {
                UpdateUser(employeeData).then(() => {
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
            UpdateUser(employeeData).then(() => {
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

    const user = await Employees.findOne({
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

    const user = await Employees.findOne({
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
    const _transactionEmployee = await Employees.sequelize.transaction();
    const _transactionUser = await Users.sequelize.transaction();
    try {
        UploadPhoto(base64image, "users")
            .then(async (response) => {
                const employee = await Employees.findByPk(req.body.id)

                var employeeData = employee["dataValues"]
                employeeData.photoUrl = response.url;

                Employees.update(
                    employeeData,
                    {
                        where: {
                            id: req.body.id,
                        },
                    },
                    _transactionEmployee
                );

                Users.update(
                    employeeData,
                    {
                        where: {
                            id: req.body.id,
                        },
                    },
                    _transactionUser
                );

                await Promise.all([
                    _transactionEmployee.commit(),
                    _transactionUser.commit(),
                ]);

                res.status(200).json({
                    message: "Upload photo success !",
                    response: response,
                });
            })
            .catch(async (error) => {
                await Promise.all([
                    _transactionEmployee.rollback(),
                    _transactionUser.rollback(),
                ]);
                console.log("Error upload photo :", error);
                res.status(500).json({ message: "Error upload photo", error });
            });
    } catch (error) {
        await Promise.all([
            _transactionEmployee.rollback(),
            _transactionUser.rollback(),
        ]);
        res.status(500).json({ message: "Error upload photo" });
    }
});

module.exports = router;
