import axios from './api'

const GetCustomers = (page, size, searchText, companyId) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `/customer?page=${page}&size=${size}&search=${searchText}`,
      method: 'get'
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}


const GetById = (id) => {
  return new Promise((resolve, reject) => {
    axios({
      url: '/customer/get-by-id',
      method: 'get',
      headers: { customerId: id },
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const UpdateEmployee = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      url: '/customer/update',
      method: 'put',
      data: data,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const UploadPhoto = (base64image, userId) => {
  return new Promise((resolve, reject) => {
    axios({
      url: '/customer/upload-photo',
      method: 'post',
      data: {
        base64image: base64image,
        id: userId,
      },
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export { GetCustomers, GetById, UpdateEmployee, UploadPhoto }
