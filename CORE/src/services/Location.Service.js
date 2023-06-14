const url = process.env.REACT_APP_API_LOCATION_SERVER
import axios from "../services/api"

function GetProvinces() {
    return new Promise((resolve, reject) => {
        axios({
            url: '/location/provinces'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetProvinceById(id) {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/province/${id}`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetCities() {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/cities`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetCityById(id) {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/city/${id}`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetCityByProvinceId(provinceId) {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/city/province-id/${provinceId}`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetDistricts() {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/districts`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetDistrictById(id) {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/district/${id}`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetDistrictByCityId(cityid) {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/district/city-id/${cityid}`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetSubDistricts() {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/subdistricts`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetSubDistrictById(id) {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/subdistrict/${id}`,
            method: 'GET'
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetSubDistrictByDistrictId(districtId) {
    return new Promise((resolve, reject) => {
        axios({
            url: `/location/sub-district/district-id/${districtId}`
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function GetSubDistrictByPostalcode(postalcode) {
    return new Promise((resolve, reject) => {
        fetchDataToJson(`${url}/subdistrict/postalcode/${postalcode}`, 'GET', null, null)
            .then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error)
            })
    })
}

async function fetchDataToJson(url, method, headers, body) {
    headers = headers ? headers : { "Content-Type": "application/json" }
    const _fetch = await fetch(url, {
        method: method,
        headers: headers,
        body: body
    })

    return _fetch.json()
}

export {
    GetProvinces,
    GetProvinceById,
    GetCities,
    GetCityById,
    GetCityByProvinceId,
    GetDistricts,
    GetDistrictById,
    GetDistrictByCityId,
    GetSubDistricts,
    GetSubDistrictById,
    GetSubDistrictByDistrictId,
    GetSubDistrictByPostalcode
}