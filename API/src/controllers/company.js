const express = require('express');
const router = express.Router();
const { Companies } = require("../models/index.model");
const { Op } = require("sequelize");
const { CompanyClass } = require('../class/index.class');
const { GetPagination, GetPagingData } = require("../services/util.services");
const { UploadPhoto } = require("../services/user.services");
const db = require("../config/db");

/**
 * Get All Company
 */
router.get('/', async (req, res) => {
    var { page, size, search } = req.query;
    const { limit, offset } = GetPagination(page, size);
    search = search ? search : '';

    try {
        const companies = await Companies.findAndCountAll({
            order: [
                ['name', 'ASC']
            ],
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: ['%' + search + '%']
                        }
                    },
                    {
                        code: {
                            [Op.like]: ['%' + search + '%']
                        }
                    }
                ]
            },
            limit: limit,
            offset: offset
        });

        const response = GetPagingData(companies, limit);
        res.json(response);

    } catch (error) {
        console.log(error);
    }
});

router.get('/get-by-id', async (req, res) => {
    const companyId = req.headers['companyid'];
    console.log(companyId)
    try {
        const company = await Companies.findOne({
            where: {
                id: companyId
            }
        });
        res.status(200).json(company);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error", error: error })
    }
});

/**
 * 
 */
router.put("/update-photo", async (req, res) => {
    let { id, photoUrl } = req.body;
    let company = await Companies.findByPk(id);

    if (!company) {
        return res.status(400).json({ message: 'Company not found !' })
    }

    try {
        await Companies.update({ photoUrl: photoUrl }, {
            where: {
                id: id
            }
        });

        const response = await Companies.findByPk(id);

        res.status(200).json({
            message: 'Success !',
            company: response
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Update failed !'
        })
    }
})

/**
 * 
 */
router.put("/update", async (req, res) => {
    var body = req.body;
    let company = await Companies.findByPk(body['id']);

    if (!company) {
        return res.status(400).json({ message: 'Company not found !' })
    }

    try {
        var dataSource = new CompanyClass(company);
        var companyData = pacthValue(dataSource, body);

        await Companies.update(companyData, {
            where: {
                id: companyData.id
            }
        });

        res.status(200).json({
            message: 'Success !',
            company: companyData
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Update failed !',
            error: error
        })
    }
});

router.post('/upload-photo', async (req, res) => {
    var base64image = req.body.base64image;
    try {
        var companyPhoto = await UploadPhoto(base64image, 'companies')
        const company = await Companies.findOne({
            where: {
                id: req.body.id
            }
        });

        var companyData = company["dataValues"];
        companyData.photoUrl = companyPhoto.url;

        await Companies.update(companyData, {
            where: {
                id: companyData.id
            }
        });

        res.status(200).json({ message: 'Upload photo success' })

    } catch (error) {
        res.status(400).json({ message: 'Error' })
    }
})

/**
 * 
 */
function pacthValue(source, data) {
    source.id = data.id;
    source.name = data.name;
    source.brand = data.brand;
    source.code = data.code
    source.email = data.email;
    source.address = data.address;
    source.city = data.city;
    source.province = data.province;
    source.postalCode = data.postalCode;
    source.lat = data.lat;
    source.lng = data.lng;
    source.phoneNumber = data.phoneNumber;
    source.phoneNumberVerification = data.phoneNumberVerification;
    source.fax = data.fax;
    source.officeTelp = data.officeTelp;
    source.website = data.website;
    source.createdAt = source.createdAt;
    source.updatedAt = source.updatedAt;
    source.deletedAt = source.deletedAt;
    source.deviceTokenId = data.deviceTokenId;

    source.subDistrict = data.subDistrict;
    source.subDistrictId = data.subDistrictId;
    source.district = data.district;
    source.districtId = data.districtId;
    source.cityId = data.cityId;
    source.provinceId = data.provinceId;
    source.countryId = data.countryId;
    source.countryName = data.countryName;
    source.npwp = data.npwp;
    source.linkedIn = data.linkedIn;
    source.facebook = data.facebook;
    source.twitter = data.twitter;
    source.instagram = data.instagram;
    source.tiktok = data.tiktok;

    source.scheduleMadeBefore = data.scheduleMadeBefore;
    source.status = data.status;

    return new CompanyClass(source);
}

module.exports = router;