import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AuthLogin } from '../../../services/Auth.Service'

import CryptoJS from 'crypto-js'

import { VscEye } from "react-icons/vsc";
import { RxEyeClosed } from "react-icons/rx";
import { CgLogIn } from "react-icons/cg";

import './login.scss'
import './tailwind.css'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import HeaderAuth from '../../../components/HeaderAuth'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'

const Login = () => {
  var navigate = useNavigate()
  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [alertErrorMessage, setAlertErrorMessage] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const emailRef = useRef("");
  const passwordRef = useRef("")

  const [loading, setLoading] = React.useState(false);
  const [openBackdrop, setOPenBackdrop] = useState(false)

  const { t } = useTranslation();

  useEffect(() => {
    setUser('superadmin@brothercasual.com')
    setPwd('pass@12345')
    setShowPassword(false)
    setOPenBackdrop(false)
  }, [])

  async function submitForm() {
    setAlertErrorMessage(false)
    var data = {
      email: user,
      password: pwd
    },
      headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }

    setLoading(true)
    setOPenBackdrop(true)

    try {
      AuthLogin(data, headers)
        .then((response) => {
          const data = CryptoJS.AES.encrypt(
            JSON.stringify(response),
            process.env.REACT_APP_SECRET_KEY,
          )
          globalThis.sessionStorage.setItem('api', data)

          setLoading(false)
          setOPenBackdrop(false)
          navigate('/dashboard')
          globalThis.location.reload()
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
          setOPenBackdrop(false)
          setErrMsg(error.response.data.message)
          setAlertErrorMessage(true)
        })
    } catch (error) {
      console.log(error)
      setLoading(false)
      setOPenBackdrop(false)
      setErrMsg(error.response.data.message)
      setAlertErrorMessage(true)
    }
  }

  function nextField(value, type) {
    if (value.keyCode === 13) {
      if (type === "email") {
        passwordRef.current.focus();
      } else {
        submitForm();
      }
    }

  }


  const forgotPassword = () => {
    navigate('/forgot-password')
  }


  return (
    <>
      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <div className="relative w-full h-full py-40 min-h-screen">
        <div className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full bg-image">
          <HeaderAuth />
        </div>
        <div className='bg-image'>
          <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
              <div className="w-full  px-4">
                <CContainer>
                  <CRow className="justify-content-center">
                    <CCol md={8}>
                      <CCardGroup>
                        <CCard className="p-4">
                          <CCardBody>
                            <CAlert color="danger" visible={alertErrorMessage} dismissible>
                              {errMsg}
                            </CAlert>
                            <CForm>
                              <h1>{t('login')}</h1>
                              {/* <p className="text-medium-emphasis">Sign In to your account</p> */}
                              <p className="text-medium-emphasis">{t('login_description')}</p>
                              <CInputGroup className="mb-3">
                                <CInputGroupText>
                                  <CIcon icon={cilUser} />
                                </CInputGroupText>
                                <CFormInput
                                  type="email"
                                  placeholder="Email"
                                  autoComplete="off"
                                  id="email"
                                  ref={emailRef}
                                  onChange={(e) => setUser(e.target.value)}
                                  onKeyDown={(e) => nextField(e, "email")}
                                  value={user}
                                  required
                                />
                              </CInputGroup>
                              <CInputGroup className="mb-4">
                                <CInputGroupText>
                                  <CIcon icon={cilLockLocked} />
                                </CInputGroupText>
                                <CFormInput
                                  type={showPassword ? 'email' : 'password'}
                                  placeholder="Password"
                                  autoComplete="off"
                                  id="password"
                                  ref={passwordRef}
                                  onChange={(e) => setPwd(e.target.value)}
                                  onKeyDown={(e) => nextField(e, "password")}
                                  value={pwd}
                                  required
                                />
                                <CInputGroupText onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                  {showPassword ? <VscEye /> : <RxEyeClosed />}
                                </CInputGroupText>
                              </CInputGroup>
                              <CRow>
                                <CCol>
                                  {/* <LoadingButton
                                    size="small"
                                    onClick={submitForm}
                                    endIcon={< LoginIcon />}
                                    loading={loading}
                                    loadingPosition="end"
                                    variant="contained"
                                  >
                                    {t('login')}
                                  </LoadingButton> */}
                                  <CButton
                                    onClick={submitForm}
                                    style={{
                                      height: 40,
                                      width: "100%",
                                      fontSize: 20,
                                      background: '#00BBFF',
                                      color: '#FFFFFF',
                                      border: 'none'
                                    }}>{t('login')} < LoginIcon style={{ marginLeft: 5 }} /></CButton>
                                </CCol>
                              </CRow>
                            </CForm>
                          </CCardBody>
                          <div style={{ textAlign: 'center' }}>
                            <u style={{ cursor: 'pointer' }} onClick={forgotPassword}><b>lupa sandi ?</b></u>
                          </div>
                        </CCard>
                      </CCardGroup>
                    </CCol>
                  </CRow>
                </CContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
