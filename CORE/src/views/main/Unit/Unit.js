import React, { useState, useEffect, useRef } from 'react'

import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CForm,
    CFormInput,
    CFormTextarea,
    CAlert,
} from '@coreui/react'

import axios from '../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import background from '../../../assets/bg2.png'

import { User } from '../../../models/user.class'
import { Backdrop, CircularProgress, Snackbar, TextField } from '@mui/material'

import LayoutService from '../../../services/Layout.Service'

const columns = [
    {
        name: 'Nama',
        selector: (row) => row.name,
        sortable: true,
    },
    {
        name: 'Kode',
        selector: (row) => row.code,
        sortable: true,
    },
]

const Unit = () => {
    var componentData
    const userLogin = new User(useSelector((state) => state.user))
    const navigationList = useSelector((state) => state.navigation)
    const rolePermission = useSelector((state) => state.role.permissions)
    var [categoryList, setCategoryList] = useState(new Array())
    const [visible, setVisible] = useState(false)

    let user = new User(useSelector((state) => state.user))

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [thumb, setThumb] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [updateBy, setUpdatedBy] = useState('')

    const [alertVisible, setAlertVisible] = useState(false)
    const [alertRoleVisible, setAlertRoleVisible] = useState(false)
    const [alertRole, setAlerRole] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [pageType, setPageType] = useState('new')
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)

    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false);
        getUnits(page, perPage, ''), defaultValue()
    }, [])

    const getUnits = (_page, _perPage, searchText) => {
        GetUnits(_page, _perPage, searchText)
            .then((response) => {
                setCategoryList(response.result)
                setTotalRows(response.totalItems)
            })
            .catch((error) => {
                console.log(error)
                // Error handling
            })
    }

    const handlePageChange = (page) => {
        var _page = Number(page) - 1
        setPage(_page)
        getUnits(_page, perPage, '')
    }

    const handlePerRowsChange = async (userPerPage, _page) => {
        setPerPage(userPerPage)
        getUnits(page, userPerPage, '')
    }

    function GetUnits(page, size, searchText) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/unit?page=${page}&size=${size}&search=${searchText}`,
                method: 'get',
            })
                .then((response) => {
                    resolve(response.data)
                    setCategoryList(response.data.result)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    function openForm() {
        let permissionRole = rolePermission.find(
            (perm) => perm.permissionName.toLowerCase() === 'unit',
        )
        if (permissionRole) {
            if (permissionRole.permissionCreate) {
                setPageType('new')
                defaultValue()
                setAlertVisible(false)
                setVisible(!visible)
            } else {
                setAlertRoleVisible(true)
                setAlerRole(`Sorry... You don't have access !`)
            }
        } else {
            setAlertRoleVisible(true)
            setAlerRole(`Sorry... You don't have access !`)
        }
    }

    const clickRow = (row, event) => {
        let permissionRole = rolePermission.find(
            (perm) => perm.permissionName.toLowerCase() === 'unit',
        )
        if (permissionRole) {
            if (permissionRole.permissionEdit) {
                setAlertVisible(false)
                setPageType('edit')
                setValue(row)
                setVisible(!visible)
            } else {
                setAlertRoleVisible(true)
                setAlerRole(`Sorry... You don't have access !`)
            }
        } else {
            setAlertRoleVisible(true)
            setAlerRole(`Sorry... You don't have access !`)
        }
    }

    function submitForm() {
        var data = {
            id: id,
            name: name,
            code: code,
            createdBy: pageType === 'new' ? userLogin.id : createdBy,
            updatedBy: pageType === 'new' ? null : userLogin.id
        }

        if (hasNull({ name: name, code: code })) {
            handleClick()
            return
        }

        setLoading(true)

        axios({
            url: pageType === 'new' ? '/unit/new' : '/unit/update',
            method: pageType === 'new' ? 'post' : 'put',
            data: data,
        })
            .then(() => {
                setLoading(false)
                pageType === 'new' ? setAlertMsg(`Berhasil menambah data`) : setAlertMsg(`Berhasil memperbarui data`);
                setVisible(false)
                getUnits(page, perPage, '')
                handleClick()
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
                setAlertMessage(
                    error.response.data.message
                        ? error.response.data.message
                        : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
                )
                setAlertVisible(true)
            })
    }

    function search(event) {
        getUnits(page, perPage, event.toLowerCase())
    }

    function defaultValue() {
        setId('')
        setName('')
        setCode('')
        setThumb('')
        setCreatedBy('')
        setUpdatedBy('')
        setAlertVisible(false)
        setAlertMessage('')
        setVisible(false)
        setAlertRoleVisible(false)
    }

    function setValue(value) {
        setId(value.id)
        setName(value.name)
        setCode(value.code)
        setThumb(value.description)
        setCreatedBy(value.createdBy)
        setUpdatedBy(value.updatedBy)
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

    const hasNull = (target) => {
        for (var value in target) {
            if (target[value] === '' || target[value] === null) {
                switch (value) {
                    case 'code':
                        setAlertMsg(`Kode harus di isi`)
                        break
                    case 'name':
                        setAlertMsg(`Nama harus di isi`)
                        break
                    default:
                        break
                }
                return true
            }
        }
        return false
    }

    let findConfigPage = navigationList.find((e) => e.name.toLowerCase() === 'configuration')
    let findPage = findConfigPage.items.find((e) => e.name.toLowerCase().replace(/\s+/g, "") === 'unit')

    if (findPage && user.status === "active") {
        componentData = (
            <>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
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
                <CRow>
                    <CModal
                        alignment="center"
                        visible={alertRoleVisible}
                        onClose={() => setAlertRoleVisible(false)}
                    >
                        <CModalHeader>
                            <CModalTitle>Warning !</CModalTitle>
                        </CModalHeader>
                        <CModalBody>{alertRole}</CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setAlertRoleVisible(false)}>
                                OK
                            </CButton>
                        </CModalFooter>
                    </CModal>
                    <CCol xs>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <CRow className="justify-content-between">
                                    <CCol xs="auto" className="me-auto">
                                        <h5>
                                            <b>Satuan</b>
                                        </h5>
                                    </CCol>
                                    <CCol xs="auto">
                                        <CButton
                                            style={{
                                                width: "250px",
                                                fontSize: 18,
                                                background: '#00BBFF',
                                                color: '#FFFFFF',
                                                border: 'none'
                                            }}
                                            onClick={openForm}>
                                            Buat Satuan
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CCardHeader>
                            <CCardBody>
                                <CFormInput
                                    type="text"
                                    placeholder="Search..."
                                    onKeyUp={(e) => search(e.target.value)}
                                />
                                <br></br>
                                <DataTable
                                    columns={columns}
                                    data={categoryList}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    onChangePage={handlePageChange}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    onRowClicked={clickRow}
                                    highlightOnHover
                                    paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                    customStyles={LayoutService().customStylesDataTable()}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CModal
                        alignment="center"
                        size="lg"
                        visible={visible}
                    >
                        <CAlert
                            color="primary"
                            dismissible
                            visible={alertVisible}
                            onClose={() => setAlertVisible(false)}
                        >
                            {alertMessage}
                        </CAlert>
                        <CModalHeader closeButton={false}>
                            <CModalTitle>{pageType === 'new' ? 'tambah satuan' : name}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CForm>
                                <CRow>
                                    <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                        <TextField
                                            id="standard-basic"
                                            label="Kode"
                                            variant="standard"
                                            fullWidth
                                            error={code.length == 0}
                                            onChange={(e) => setCode(e.target.value)}
                                            value={code}
                                        />
                                    </CCol>
                                </CRow> <br />
                                <CRow>
                                    <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Nama"
                                            variant="standard"
                                            fullWidth
                                            error={name.length == 0}
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                        />
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisible(false)}>
                                batal
                            </CButton>
                            <CButton color="primary" onClick={submitForm}>
                                {pageType === 'edit' ? 'tambah' : 'simpan'}
                            </CButton>
                        </CModalFooter>
                    </CModal>
                </CRow>
            </>
        )
    } else {
        componentData = (
            <CRow>
                <CCard className="mb-4">
                    <CCardBody>
                        <div>
                            <div
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <span>Sorry..</span>
                                <br></br>
                                <span style={{ color: 'red' }}>
                                    <b>You don't have access !</b>
                                </span>
                            </div>
                            <img
                                src={background}
                                style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    width: '50%',
                                }}
                            ></img>
                        </div>
                    </CCardBody>
                </CCard>
            </CRow>
        )
    }

    return componentData
}

export default Unit
