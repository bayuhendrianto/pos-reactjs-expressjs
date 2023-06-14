const admin = require("firebase-admin")
const { v4: uuid } = require("uuid");

const serviceAccount = require("./servicesAccount.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const firestore = admin.firestore();

function sendNotification(token, messages) {
    let payload = {
        "notification": {
            "title": 'Balen App Dev',
            "body": messages,
            "sound": 'default',
            "image": "https://storage.dayanatura.com/assets/logo/logo-balen-hitam.png",
        }
    }

    admin.messaging().sendToDevice(token, payload).then((response) => {

    }).catch((error) => {
        //
    })
}

function addData(collectionName, data, id) {
    data['createdAt'] = new Date()
    return new Promise((resolve, reject) => {
        firestore.collection(collectionName).doc(id).set(data)
            .then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error)
            })
    })
}

function addBulkData(collectionName, data) {
    let bulkData = new Array()
    bulkData = data;
    return new Promise(async (resolve, reject) => {
        let batch = firestore.batch();
        try {
            bulkData.forEach((item) => {
                item['createdAt'] = new Date()
                const refNotif = firestore.collection(collectionName).doc(item.id);
                batch.set(refNotif, item, { merge: true });
            });

            const result = await batch.commit();

            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

function getData(collectionName) {
    return new Promise((resolve, reject) => {
        let values = new Array()
        firestore.collection(collectionName).onSnapshot((data) => {
            data.forEach((item) => {
                values.push(item.data)
            });

            resolve(values)
        }, (error) => {
            reject(error)
        })
    })
}

function updateData(collectionName, data, id) {
    return new Promise((resolve, reject) => {
        firestore.doc(`${collectionName}/${id}`).update(data)
            .then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error)
            })
    })
}

module.exports = {
    addData, addBulkData, getData, updateData, sendNotification
}