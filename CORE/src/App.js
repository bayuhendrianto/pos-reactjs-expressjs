import React, { Component, Suspense, useRef, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import './scss/_public.scss'

import './i18n.js'

import axios from "./services/api"

import { messaging } from "./firebase-config"
import { getToken, onMessage } from "firebase/messaging";
import { useDispatch, useSelector } from 'react-redux'
import { CompanyModel } from './models/company.class'
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgot-password/forgot-password'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// class App extends Component {
//   render() {
//     return routes
//   }
// }

const Application = () => {
  var session = globalThis.sessionStorage.getItem('api')
  const dispatch = useDispatch()
  const company = new CompanyModel(useSelector((state) => state.company));

  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const firebaseMessaging = () => {
    getToken(messaging, { vapidKey: "BCEc5-SkMSjzRsoOdIgl1tjSxVfUIwpVw1yypcECluf2fGT-gLIGoKfPBMl8O9vAGxJkc9DLvUiGZeqD_a5sqko" })
      .then((token) => {
        updateCompany(token)
      }).catch((error) => {

      })
  }

  if (company.id !== null) {
    // firebaseMessaging()
  }

  const updateCompany = (token) => {
    axios({
      url: '/company/get-by-id',
      method: 'get',
      headers: {
        companyId: company.id
      }
    }).then((response) => {
      let companyData = new CompanyModel(response.data);
      companyData.deviceTokenId = token;

      axios({
        url: '/company/update',
        method: 'put',
        data: companyData
      }).then(() => {
      }).catch((error) => {
      })
    })
  }

  onMessage(messaging, (payload) => {
    console.log(payload)
    addToast(exampleToast(payload))
    // dispatch({ type: "notif", company: payload });
    // ...
  });

  const exampleToast = (payload) => {
    return (
      <CToast color='primary'>
        <CToastHeader>
          <img src="https://storage.dayanatura.com/assets/logo/logo-balen-hitam.png" width={70}></img>
        </CToastHeader>
        <CToastBody>
          <div style={{ color: "#ffffff" }}>{payload.notification.body}</div>
        </CToastBody>
      </CToast>
    )
  }

  let routes = (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/forgot-password" name="Forgot Password Page" element={<ForgotPassword />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )

  if (session) {
    routes = (
      <>
        <CToaster ref={toaster} push={toast} placement="top-end" />

        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </>
    )
  }

  return routes;
}

export default Application
