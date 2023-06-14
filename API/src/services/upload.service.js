const fs = require('fs');
const originUrl = "http://localhost:3000/";
const path = require('path');
const sharp = require("sharp");

function uploadBase64WithResize(base64data, fileName, width, height) {
    return new Promise((resolve, reject) => {
        if (!base64data) {
            reject('data not found')
        }

        let matches = base64data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let name = `${new Date().getTime()}-${fileName}`;
        width = width ? Number(width) : 360;
        height = height ? Number(height) : 360;

        if (matches.length !== 3) {
            reject('Invalid input string');
        }

        let imageBuffer = Buffer.from(matches[2], 'base64');

        sharp(imageBuffer).resize({ width: Number(width), height: Number(height) })
            .toFile(path.join(__dirname, `../../assets/${name}`))
            .then(() => {
                resolve({
                    "status": "success",
                    "url": originUrl + "assets/" + name
                })
            }).catch((error) => {
                reject(error);
            })
    })
}

function uploadBase64(base64data, fileName) {
    return new Promise((resolve, reject) => {
        let name = `${new Date().getTime()}-${fileName}`;
        if (!base64data) {
            reject('data not found')
        }

        let matches = base64data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (matches.length !== 3) {
            reject('Invalid input string');
        }

        let imageBuffer = Buffer.from(matches[2], 'base64');

        try {
            fs.writeFileSync(path.join(__dirname, `../../assets/${name}`), imageBuffer, 'utf8');
            resolve({
                "status": "success",
                "url": originUrl + "assets/" + name
            })
        } catch (error) {
            reject(error);
        }
    })
}

function uploadSingleDocument(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            var fileName = req.file.filename;
            resolve({
                status: "success",
                url: originUrl + `assets/${fileName}`,
            })
        } catch (error) {
            reject(error);
        }
    })
}

function uploadMultipleDocument(req, res) {
    return new Promise((resolve, reject) => {
        try {
            let response = new Array();
            req.files.forEach((file, index) => {
                response.push({
                    fileName: file.filename,
                    url: originUrl + `assets/${file.filename}`,
                });

                if (index === (req.files.length - 1)) {
                    resolve(response)
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}

function uploadSinglePhotoResize(req, res) {
    return new Promise(async (resolve, reject) => {

        const { buffer, originalname } = req.file;
        let { width, height } = req.query;

        width = width ? Number(width) : 360;
        height = height ? Number(height) : 360;

        const timestamp = Date.now();
        const fileName = `${timestamp}-${originalname}`;

        console.log({
            width, height,
            originalname,
            fileName, buffer
        })
        try {
            sharp(buffer).resize({ width: Number(width), height: Number(height) })
                .toFile(path.join(__dirname, `../../assets/${fileName}`))
                .then(() => {
                    resolve({
                        "status": "success",
                        "url": originUrl + "assets/" + fileName
                    })
                }).catch((error) => {
                    reject(error);
                })
        } catch (error) {
            reject(error)
        }
    })
}

function uploadMultiplePhotoResize(files, width, height) {
    return new Promise((resolve, reject) => {

    })
}

module.exports = {
    uploadBase64WithResize,
    uploadBase64,
    uploadSingleDocument,
    uploadMultipleDocument,
    uploadSinglePhotoResize
}