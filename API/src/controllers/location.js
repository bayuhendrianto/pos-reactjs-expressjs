const express = require('express');
const router = express.Router();

const provinces = require("../location/loc_provinces.json");
const cities = require("../location/loc_cities.json");
const districts = require("../location/loc_districts.json");
const subdistricts = require("../location/loc_subdistricts.json");

provinces.sort((a, b) => {
    if (a.prov_name > b.prov_name) return 1;
    if (a.prov_name < b.prov_name) return -1;
    return 0;
})

cities.sort((a, b) => {
    if (a.city_name > b.city_name) return 1;
    if (a.city_name < b.city_name) return -1;
    return 0;
})

districts.sort((a, b) => {
    if (a.dis_name > b.dis_name) return 1;
    if (a.dis_name < b.dis_name) return -1;
    return 0;
})

subdistricts.sort((a, b) => {
    if (a.subdis_name > b.subdis_name) return 1;
    if (a.subdis_name < b.subdis_name) return -1;
    return 0;
})

router.get('/provinces', (req, res) => {
    let { page, size, searchText } = req.query;

    try {

        if (searchText) {
            let filterProvince = provinces.filter((p) => p.prov_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
            if (filterProvince.length > 0) {
                return res.status(200).json({
                    totalItems: filterProvince.length,
                    totalRows: 1,
                    result: filterProvince
                })
            } else {
                return res.status(200).json({
                    totalItems: 0,
                    totalRows: 0,
                    result: []
                })
            }
        } else {
            return res.status(200).json({
                totalItems: provinces.length,
                totalRows: 1,
                result: provinces
            })
        }

    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/province/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Error" })
    }

    try {
        let findProvince = provinces.find((p) => p.prov_id === id);
        return res.status(200).json(findProvince ? findProvince : null)
    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/cities', (req, res) => {
    let { page, size, searchText } = req.query;
    let { pageConvert, sizeConvert } = generatePageSize(page, size);

    try {

        if (searchText) {
            let filterCities = cities.filter((p) => p.city_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
            if (filterCities.length > 0) {
                if (filterCities.length >= 10) {
                    return res.status(200).json(pagination(filterCities, pageConvert, sizeConvert))
                } else {
                    return res.status(200).json(paginationLow(filterCities))
                }
            } else {
                return res.status(200).json(null)
            }
        } else {
            return res.status(200).json(pagination(cities, pageConvert, sizeConvert))
        }

    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/city/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Error" })
    }

    try {
        let findCity = cities.find((p) => p.city_id === id);
        res.status(200).json(findCity ? findCity : null)
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

router.get('/city/province-id/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Error" })
    }

    try {
        let findCity = cities.filter((c) => c.prov_id === id);
        return res.status(200).json({
            totalItems: findCity.length,
            totalRows: 1,
            result: findCity
        })
    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/districts', (req, res) => {
    let { page, size, searchText } = req.query;
    let { pageConvert, sizeConvert } = generatePageSize(page, size);

    try {

        if (searchText) {
            let filterCities = districts.filter((p) => p.city_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
            if (filterCities.length > 0) {
                if (filterCities.length >= 10) {
                    return res.status(200).json(pagination(filterCities, pageConvert, sizeConvert))
                } else {
                    return res.status(200).json(paginationLow(filterCities))
                }
            } else {
                return res.status(200).json(null)
            }
        } else {
            return res.status(200).json(pagination(districts, pageConvert, sizeConvert))
        }

    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/district/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Error" })
    }

    try {
        let findDistrict = districts.find((p) => p.dis_id === id);
        return res.status(200).json(findDistrict ? findDistrict : null)
    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/district/city-id/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Error" })
    }

    try {
        let findDistrict = districts.filter((c) => c.city_id === id);
        return res.status(200).json({
            totalItems: findDistrict.length,
            totalRows: 1,
            result: findDistrict
        })
    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/sub-districts', (req, res) => {
    let { page, size, searchText } = req.query;
    let { pageConvert, sizeConvert } = generatePageSize(page, size);

    try {

        if (searchText) {
            let filterSubDistricts = subdistricts.filter((p) => p.subdis_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
            if (filterSubDistricts.length > 0) {
                if (filterSubDistricts.length >= 10) {
                    return res.status(200).json(pagination(filterSubDistricts, pageConvert, sizeConvert))
                } else {
                    return res.status(200).json(paginationLow(filterSubDistricts))
                }
            } else {
                return res.status(200).json(null)
            }
        } else {
            return res.status(200).json(pagination(subdistricts, pageConvert, sizeConvert))
        }

    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/sub-district/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Error" })
    }

    try {
        let findSubDistrict = subdistricts.find((p) => p.dis_id === id);
        return res.status(200).json(findSubDistrict ? findSubDistrict : null)
    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

router.get('/sub-district/district-id/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Error" })
    }

    try {
        let findSubDistrict = subdistricts.filter((c) => c.dis_id === id);
        return res.status(200).json({
            totalItems: findSubDistrict.length,
            totalRows: 1,
            result: findSubDistrict
        })
    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }
})

function generatePageSize(page, size) {
    if (page) {
        if (parseInt(page) <= 1) {
            page = 1;
        } else {
            page = parseInt(page)
        }
    } else {
        page = 1
    }

    if (size) {
        if (parseInt(size) <= 10) {
            size = 10;
        } else {
            size = parseInt(size)
            if (parseInt(size) >= 100) {
                size = 100;
            } else {
                size = parseInt(size)
            }
        }
    } else {
        size = 10;
    }

    let result = {
        pageConvert: page,
        sizeConvert: size
    }

    return result
}

function pagination(array, page, size) {
    let response = {
        totalItems: array.length,
        totalRows: Math.ceil(parseInt(array.length) / size),
        result: array.slice((page - 1) * size, page * size)
    };

    return response;
}

function paginationLow(array) {
    let response = {
        totalItems: array.length,
        totalRows: 1,
        result: array
    };

    return response;
}

module.exports = router;