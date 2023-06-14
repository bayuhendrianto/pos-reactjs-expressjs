import axios from './api'

function AuthLogin(data, headers) {
    return new Promise((resolve, reject) => {
        axios({
            url: '/auth/login',
            method: 'post',
            headers: headers,
            data: data
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function AuthLogout() {
    return new Promise((resolve, reject) => {
        axios({
            url: '/auth/logout',
            method: 'post',
            headers: {},
            data: {}
        }).then((response) => {
            console.log(response)
            globalThis.sessionStorage.clear()
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export {
    AuthLogin,
    AuthLogout
}