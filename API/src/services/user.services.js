const { Users, Employees, Customers, Suppliers } = require("../models/user.model")
const axios = require('axios').default;

function UpdateUser(userData) {
    return new Promise(async (resolve, reject) => {
        switch (userData['group']) {
            case 'employee':
                Promise.all([
                    Users.update(userData, {
                        where: {
                            id: userData['id']
                        }
                    }),
                    Employees.update(userData, {
                        where: {
                            id: userData['id']
                        }
                    })
                ]).then(() => {
                    resolve()
                }).catch((error) => {
                    reject(error)
                })
                break;

            case 'customer':
                Promise.all([
                    Users.update(userData, {
                        where: {
                            id: userData['id']
                        }
                    }),
                    Customers.update(userData, {
                        where: {
                            id: userData['id']
                        }
                    })
                ]).then(() => {
                    resolve()
                }).catch((error) => {
                    reject(error)
                })
                break;

            case 'supplier':
                Promise.all([
                    Users.update(userData, {
                        where: {
                            id: userData['id']
                        }
                    }),
                    Suppliers.update(userData, {
                        where: {
                            id: userData['id']
                        }
                    })
                ]).then(() => {
                    resolve()
                }).catch((error) => {
                    reject(error)
                })
                break;

            default:
                break;
        }
    })
}

function UploadPhoto(base64image, path) {
    var formatFile = base64image.split("/")[1].split(";")[0];
    return new Promise((resolve, reject) => {
        axios({
            url: `${process.env.STORAGE_SERVER_URL}/upload/base64-resize?width=360&height=360`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            data:
            // Below is the HTTP request body in JSON
            {
                path: path,
                fileName: `${new Date().getTime().toString()}.${formatFile}`,
                base64image: base64image
            }
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

module.exports = {
    UpdateUser,
    UploadPhoto
}