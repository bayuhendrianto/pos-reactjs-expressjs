const express = require('express');
const router = express.Router();
const { Roles } = require("../models/index.model");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const db = require("../config/db");
const { RoleList, RoleClass } = require("../class/index.class");
const { GetPagination, GetPagingData } = require("../services/util.services");

/**
 * 
 */
router.get('/core', async (req, res) => {
    const companyId = req.headers['companyid'];
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);

    search = search ? search : '';

    if (companyId == null || companyId == undefined) {
        return res.status(404).json('Not found !')
    }

    try {
        const roles = await Roles.findAndCountAll({
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
                    },
                    {
                        description: {
                            [Op.like]: ['%' + search + '%']
                        }
                    }
                ]
            },
            limit: limit,
            offset: offset
        });

        const response = GetPagingData(roles, limit);
        response.result = new RoleList(response.result)
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

    try {
        const roles = await Roles.findAndCountAll({
            where: {
                companyId: companyId
            }
        });
        res.json(new RoleList(roles.rows));
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

/**
 * 
 */
router.post('/create', async (req, res) => {
    const companyId = req.headers['companyid'];
    var roleData = req.body;
    roleData['id'] = uuid();
    roleData.permissions = JSON.stringify(roleData.permissions);
    roleData.companyId = companyId

    if (!companyId) {
        return res.status(404).json({ message: "Company IdNot Found in Headers" });
    }

    try {
        await Roles.create(roleData);

        res.json({ message: "Roles added !" });

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Roles added fail !" })
    }
});

/**
 * 
 */
router.put('/update', async (req, res) => {
    var roleData = req.body;
    roleData.permissions = JSON.stringify(roleData.permissions)

    let findById = await Roles.findByPk(roleData['id']);

    if(!findById) {
        return res.status(400).json({message: 'Data not found !'})
    }

    try {
        await Roles.update(roleData, {
            where: {
                id: roleData.id
            }
        });

        res.status(200).json({
            message: 'Success !'
        });

    } catch (error) {
        res.status(400).json({
            message: 'Update failed !'
        })
    }
});


router.get('/get-by-id', async (req, res) => {
    const roleId = req.headers['roleid'];

    if (!roleId) {
        return res.status(404).json({
            message: "Role Id Not Found"
        })
    }

    try {
        const role = await Roles.findOne({
            where: {
                id: roleId
            }
        });

        res.status(200).json(new RoleClass(role['dataValues']))

    } catch (error) {
        console.log(error)
        res.json({ message: "Could not get data !" })
    }
});

module.exports = router;