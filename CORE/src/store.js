import { legacy_createStore as createStore } from 'redux'
import navigation from './_nav'
import CryptoJS from 'crypto-js'

import axios from './services/api'
import { User } from './models/user.class'
import { CompanyModel } from './models/company.class'

import 'moment/locale/id'

var lng = globalThis.localStorage.getItem('lng');
lng ? lng : globalThis.localStorage.setItem('lng', 'id');

var data = globalThis.sessionStorage.getItem('api')
let token = null,
  companyId = null,
  user = new User(),
  role = null,
  company = new CompanyModel(),
  companyDetail = new CompanyModel()

// Initialize State
let initialState = {
  sidebarShow: true,
  navigation: [],
  token,
  role,
  user,
  companyId,
  company,
  companyDetail,
  showCompanyDetail: false,
  showCompanyDriver: false,
  showCompanyEmployee: false,
  showCompanyVehicle: false,
  fontSize: 14,
  fontSizeNavBar: 15,
  lineHeight: 4
}

if (data) {
  var bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY)
  var decrypt = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

  token = decrypt.accessToken
  companyId = decrypt.user.companyId
  user = new User(decrypt.user)
  role = decrypt.role
  company = new CompanyModel(decrypt.company)

  initialState = {
    sidebarShow: true,
    navigation: [],
    token,
    role,
    user,
    companyId,
    company,
    companyDetail,
    showCompanyDetail: false,
    showCompanyDriver: false,
    showCompanyEmployee: false,
    showCompanyVehicle: false,
    fontSize: 14,
    fontSizeNavBar: 15,
    lineHeight: 4
  }

  if (decrypt.role) {
    var permissionList = decrypt.role.permissions
    for (let i = 0; i < navigation.length; i++) {
      let perm = permissionList.find((item) => item.permissionName === navigation[i].name)
      if (perm !== undefined) {
        initialState.navigation.push(navigation[i])
      }

      if (i === navigation.length - 1) {
        let findUserPage = navigation.find((e) => e.name.toLowerCase() === 'users')
        let findConfigPage = navigation.find((e) => e.name.toLowerCase() === 'configuration')
        let findStockPage = navigation.find((e) => e.name.toLowerCase() === 'manage stock')
        let findTransactionPage = navigation.find((e) => e.name.toLowerCase() === 'transactions')

        let _findStockPage = [];
        findStockPage.items.map((item, index) => {
          let userPerm = permissionList.find(
            (c) => c.permissionName.toLowerCase() === item.name.toLowerCase(),
          )
          if (userPerm) {
            _findStockPage.push(item)
          }

          if (index === (findStockPage.items.length - 1)) {
            if (_findStockPage.length > 0) {
              findStockPage.items = _findStockPage;
              initialState.navigation.push(findStockPage);
              _findStockPage = [];
            }
          }
        })

        let _findTransactionPage = [];
        findTransactionPage.items.map((item, index) => {
          let userPerm = permissionList.find(
            (c) => c.permissionName.toLowerCase() === item.name.toLowerCase(),
          )
          if (userPerm) {
            _findTransactionPage.push(item)
          }

          if (index === (findTransactionPage.items.length - 1)) {
            if (_findTransactionPage.length > 0) {
              findTransactionPage.items = _findTransactionPage;
              initialState.navigation.push(findTransactionPage);
              _findTransactionPage = [];
            }
          }
        })

        let _findUserPage = [];
        findUserPage.items.map((item, index) => {
          let userPerm = permissionList.find(
            (c) => c.permissionName.toLowerCase() === item.name.toLowerCase(),
          )
          if (userPerm) {
            _findUserPage.push(item)
          }

          if (index === (findUserPage.items.length - 1)) {
            if (_findUserPage.length > 0) {
              findUserPage.items = _findUserPage;
              initialState.navigation.push(findUserPage);
              _findUserPage = [];
            }
          }
        })

        let _findConfigPage = [];
        findConfigPage.items.map((item, index) => {
          let configPerm = permissionList.find(
            (c) => c.permissionName.toLowerCase() === item.name.toLowerCase(),
          )
          if (configPerm) {
            _findConfigPage.push(item)
          }

          if (index === (findConfigPage.items.length - 1)) {
            if (_findConfigPage.length > 0) {
              findConfigPage.items = _findConfigPage;
              initialState.navigation.push(findConfigPage);
              _findConfigPage = [];
            }
          }
        })
      }
    }
  }
}

/**
 * Interceptors Add Request
 */
axios.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Access-Control-Allow-Origin'] = '*'

    if (initialState.token) {
      config.headers['Authorization'] = `Bearer ${initialState.token}`
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

/**
 * Interceptors Add Response
 * If response status 403 (Forbiden), redirect to login page
 */
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    if (err.response.status === 403) {
      window.alert('Your session end. Please loggedin again !')
      globalThis.sessionStorage.clear()
      globalThis.location.reload()
    }
    return Promise.reject(err)
  },
)

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {
        ...state,
        ...rest,
      }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
