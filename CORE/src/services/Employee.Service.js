import axios from './api'

const GetEmployees = (page, size, searchText, companyId) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `/employee?page=${page}&size=${size}&search=${searchText}`,
      method: 'get',
      headers: {
        companyId: companyId,
      },
      data: {},
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const CreateEmployee = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      url: '/employee/new',
      method: 'post',
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

const GetById = (id) => {
  return new Promise((resolve, reject) => {
    axios({
      url: '/employee/get-by-id',
      method: 'get',
      headers: { employeeId: id },
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
      url: '/employee/update',
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
      url: '/employee/upload-photo',
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

export { GetEmployees, CreateEmployee, UpdateEmployee, UploadPhoto, GetById }
