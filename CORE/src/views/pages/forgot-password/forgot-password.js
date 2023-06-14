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
import axios from '../../../services/api'
import { AuthLogin } from '../../../services/Auth.Service'

import CryptoJS from 'crypto-js'
import { FiMail } from "react-icons/fi";

import './style.scss'
import './tailwind.css'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import LoginIcon from '@mui/icons-material/Login';
import HeaderAuth from '../../../components/HeaderAuth'
import { useTranslation } from 'react-i18next'
import { Snackbar } from '@mui/material'

import { AiOutlineArrowLeft } from "react-icons/ai";

const ForgotPassword = () => {
    var navigate = useNavigate()
    const [email, setEmail] = useState('')

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)

    const emailRef = useRef("");
    const [openBackdrop, setOPenBackdrop] = useState(false)

    const { t } = useTranslation();

    useEffect(() => {
        setEmail('')
        setOPenBackdrop(false)
        setOpen(false)
    }, [])

    async function submitForm() {
        var data = {
            email: email,
            userType: 'core',
        },
            headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }

        if (data.email === null || data.email === "") {
            setAlertMsg('harap masukkan email valid');
            return handleClick();
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
            setAlertMsg(`Harap masukkan email karyawan yang valid `);
            return handleClick()
        }

        setOPenBackdrop(true)

        try {

            axios({
                url: '/auth/forgot-password',
                method: 'post',
                data: data,
                headers: headers
            }).then((response) => {
                setAlertMsg(`Berhasil mereset katasandi. Informasi katasandi kami kirim ke email anda.`);
                handleClick()
                setOPenBackdrop(false)
                setTimeout(() => {
                    navigate(-1)
                }, 3000);
            }).catch((error) => {
                console.log(error)
                setOPenBackdrop(false)
                setAlertMsg(error.response.data.message);
                handleClick()
            })
        } catch (error) {
            console.log(error)
            setOPenBackdrop(false)
            setAlertMsg(error.response.data.message);
            handleClick()
        }
    }

    function nextField(value, type) {
        if (value.keyCode === 13) {
            submitForm();
        }

    }

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
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

            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    autoHideDuration={3000}
                    resumeHideDuration={2000}
                    onClose={handleClose}
                    message={alertMsg}
                    key={'top' + 'center'}
                />
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
                                                        <CForm>
                                                            <div class="d-flex justify-content-center">
                                                                <h3><i class="fa fa-lock fa-4x"></i></h3>
                                                            </div>
                                                            <h1 style={{ textAlign: 'center' }}>Lupa sandi ?</h1>
                                                            <h6 style={{ textAlign: 'center' }}>Anda dapat mengatur ulang kata sandi Anda di sini.</h6>
                                                            <CInputGroup className="mb-3">
                                                                <CInputGroupText>
                                                                    <FiMail />
                                                                </CInputGroupText>
                                                                <CFormInput
                                                                    type="email"
                                                                    placeholder="Email"
                                                                    autoComplete="off"
                                                                    id="email"
                                                                    ref={emailRef}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    onKeyDown={(e) => nextField(e, "email")}
                                                                    value={email}
                                                                    required
                                                                />
                                                            </CInputGroup>
                                                            <CRow>
                                                                <CCol>
                                                                    <CButton
                                                                        onClick={submitForm}
                                                                        style={{
                                                                            width: "100%",
                                                                            fontSize: 20,
                                                                            background: '#00BBFF',
                                                                            color: '#FFFFFF',
                                                                            border: 'none'
                                                                        }}>Reset Katasandi</CButton>
                                                                </CCol>
                                                            </CRow>
                                                            <br />
                                                            <CRow>
                                                                <CCol>
                                                                    <CButton
                                                                        onClick={() => navigate('/login')}
                                                                        style={{
                                                                            width: "100%",
                                                                            fontSize: 20,
                                                                            background: '#FFD500',
                                                                            color: '#FFFFFF',
                                                                            border: 'none'
                                                                        }}> <AiOutlineArrowLeft /> kembali ke halama masuk</CButton>
                                                                </CCol>
                                                            </CRow>
                                                        </CForm>
                                                    </CCardBody>
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

export default ForgotPassword
