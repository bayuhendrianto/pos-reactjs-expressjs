import axios from './api'

const GetCompany = (page, size, searchText) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `/company/info?page=${page}&size=${size}&search=${searchText}`,
      method: 'get',
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const CreateCompany = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `/company/create`,
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

const UpdateCompany = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `/company/update`,
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

export { GetCompany, CreateCompany, UpdateCompany }
