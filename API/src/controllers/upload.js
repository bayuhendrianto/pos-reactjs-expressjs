const express = require('express');
const router = express.Router();
const sharp = require("sharp");
const path = require('path');
const originUrl = "http://localhost:3000/";
const multer = require("multer");
const util = require("util");
const fs = require("fs")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/base64", async (req, res) => {
    let { base64data, fileName } = req.body;

    try {

        let matches = base64data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let name = `${new Date().getTime()}-${fileName}`;

        if (matches.length !== 3) {
            return res.status(200).json({ message: 'Invalid input string' });
        }

        let imageBuffer = Buffer.from(matches[2], 'base64');
        fs.writeFileSync(path.join(__dirname, `../../assets/${name}`), imageBuffer, 'utf8');

        return res.status(200).json({
            "status": "success",
            "url": originUrl + "assets/" + name
        })

    } catch (error) {
        res.status(400).json({ message: "Error" })
    }

})

router.post("/base64-resize", async (req, res) => {
    let { base64data, fileName, width, height } = req.body;

    try {

        let matches = base64data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let name = `${new Date().getTime()}-${fileName}`;
        width = width ? Number(width) : 360;
        height = height ? Number(height) : 360;

        if (matches.length !== 3) {
            return res.status(200).json({ message: 'Invalid input string' });
        }

        let imageBuffer = Buffer.from(matches[2], 'base64');
        await sharp(imageBuffer).resize({ width: Number(width), height: Number(height) })
            .toFile(path.join(__dirname, `../../assets/${name}`))

        return res.status(200).json({
            "status": "success",
            "url": originUrl + "assets/" + name
        })

    } catch (error) {
        res.status(400).json({ message: "Error" })
    }

})

router.post('/single-document', upload.single("file"), (req, res) => {
    try {
        const { buffer, originalname } = req.file;

        let name = `${new Date().getTime()}-${originalname}`;
        fs.writeFileSync(path.join(__dirname, `../../assets/${name}`), buffer, 'utf8');

        return res.status(200).json({
            "status": "success",
            "fileName": name,
            "url": originUrl + "assets/" + name
        })
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

router.post('/multiple-document', upload.array("files"), (req, res) => {
    try {

        let response = new Array();
        req.files.map((item, index) => {
            const { buffer, originalname } = item;
            let name = `${new Date().getTime()}-${originalname}`;
            fs.writeFileSync(path.join(__dirname, `../../assets/${name}`), buffer, 'utf8');
            response.push({
                "status": "success",
                "fileName": name,
                "url": originUrl + "assets/" + name
            });

            if (index === (req.files.length - 1)) {
                return res.status(200).json({ response });
            }
        })


        const { buffer, originalname } = req.file;

        let name = `${new Date().getTime()}-${originalname}`;
        fs.writeFileSync(path.join(__dirname, `../../assets/${name}`), buffer, 'utf8');

        return res.status(200).json({
            "status": "success",
            "url": originUrl + "assets/" + name
        })
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})


router.post('/single-photo-resize', upload.single("file"), async (req, res) => {
    let { width, height } = req.query;
    width = width ? Number(width) : 360;
    height = height ? Number(height) : 360;

    try {

        const { buffer, originalname } = req.file;
        let name = `${new Date().getTime()}-${originalname}`;

        await sharp(buffer).resize({ width: Number(width), height: Number(height) })
            .toFile(path.join(__dirname, `../../assets/${name}`))

        return res.status(200).json({
            "status": "success",
            "fileName": name,
            "url": originUrl + "assets/" + name
        });
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

router.post('/multiple-photo-resize', upload.array("files"), (req, res) => {
    let { width, height } = req.query;
    width = width ? Number(width) : 360;
    height = height ? Number(height) : 360;

    try {

        let response = new Array();
        req.files.map(async (item, index) => {
            const { buffer, originalname } = item;
            let name = `${new Date().getTime()}-${originalname}`;

            response.push({
                "status": "success",
                "fileName": name,
                "url": originUrl + "assets/" + name
            });

            await sharp(buffer).resize({ width: Number(width), height: Number(height) })
                .toFile(path.join(__dirname, `../../assets/${name}`))

            if (index === (req.files.length - 1)) {
                return res.status(200).json({ response });
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Error" })
    }
})

module.exports = router;