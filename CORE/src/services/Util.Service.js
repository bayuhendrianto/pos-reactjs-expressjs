import axios from "../services/api"

const toBase64 = (file) => {
  let reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      resolve(event.target.result)
    }
  })
}

/**
 * Validasi file yang dipilih.
 * Masukkan nilai ukuran, ukuran digunakan untuk validasi ukuran file.
 * Parameter ukuran berdasarkan kilobyte e.g 1024 (atau sama dengan 1 MB)
 * @param {*} file
 * @param {*} size
 * @returns
 */
const validate = (file, size) => {
  let fileSize = size ? Number(size) : 1024
  if (file === null) return 'No file selected !!'

  // Validate Size
  if (file.size > fileSize * 1024) return 'Size more than 1 Mb not allowed !!'

  return ''
}

async function uploadMultipleDocument(formData, path) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.REACT_APP_API_STORAGE_SERVER}/upload/multiple-document`,
      method: 'POST',
      data: formData
    }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

async function uploadSingleDocument(formData, path) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.REACT_APP_API_STORAGE_SERVER}/upload/single-document`,
      method: 'POST',
      data: formData
    }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

async function uploadMultiplePhoto(formData, path) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.REACT_APP_API_STORAGE_SERVER}/upload/multiple-photo-resize`,
      method: 'POST',
      data: formData
    }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

async function uploadSinglePhoto(formData, path) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.REACT_APP_API_STORAGE_SERVER}/upload/single-photo-resize`,
      method: 'POST',
      data: formData
    }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

function randomNumbersLetters(length) {
  var text = '',
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export {
  toBase64,
  validate,
  uploadMultipleDocument,
  uploadSingleDocument,
  uploadMultiplePhoto,
  uploadSinglePhoto,
  randomNumbersLetters
}
