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
    CFormCheck,
    CFormSelect,
    CCardFooter,
} from '@coreui/react'

import axios from '../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import background from '../../../assets/bg2.png'
import Snackbar from '@mui/material/Snackbar'

import { User } from '../../../models/user.class'
import { Stack } from '@mui/system'
import { Input } from '@mui/material'

import './style.scss'
import { NumericFormat } from 'react-number-format'

import LayoutService from '../../../services/Layout.Service'

const columns = [
    {
        name: 'nama',
        selector: (row) => row.purpose,
        sortable: true,
    },
    {
        name: 'job (hari)',
        selector: (row) => row.value,
        sortable: true,
    },
    {
        name: 'setip hari',
        selector: (row) => row.everyday ? 'YA' : 'Tidak',
        sortable: true,
    },
]

const Setting = () => {
    var settingComponentData;
    const userLogin = new User(useSelector((state) => state.user))
    const navigationList = useSelector((state) => state.navigation)
    const rolePermission = useSelector((state) => state.role.permissions)
    var [cronjobList, setCronjobList] = useState(new Array())
    const [visible, setVisible] = useState(false)

    let user = new User(useSelector((state) => state.user))

    const [settingId, setSettingId] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [adminFeeServices, setAdminFeeServices] = useState('');
    const [adminFeeServicesPercent, setAdminFeeServicesPercent] = useState('');
    const [adminFeeInsurance, setAdminFeeInsurance] = useState('');
    const [adminFeeInsurancePercent, setAdminFeeInsurancePercent] = useState('');
    const [costPerKilometer, setCostPerKilometer] = useState('');
    const [premiInsurance, setPremiInsurance] = useState('');
    const [premiInsurancePercent, setPremiInsurancePercent] = useState('');
    const [paymentPeriodExpired, setPaymentPeriodExpired] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [updatedBy, setUpdatedBy] = useState('')

    const [cronjobId, setCronjobId] = useState('')
    const [purpose, setPurpose] = useState('')
    const [type, setType] = useState('')
    const [everyDay, setEveryDay] = useState(false)
    const [valueCronjob, setValueCronjob] = useState('')

    const [alertVisible, setAlertVisible] = useState(false)
    const [alertRoleVisible, setAlertRoleVisible] = useState(false)
    const [alertRole, setAlerRole] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [pageType, setPageType] = useState('new')
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)

    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    useEffect(() => {
        getSetting();
        getCronjob(page, perPage, '');
        defaultValue();
    }, [])

    const getSetting = () => {
        axios({
            url: `/setting/get`,
            method: 'get',
        })
            .then((response) => {
                setValueSetting(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function setValueSetting(value) {
        setSettingId(value.id);
        setCompanyId(value.companyId);
        setAdminFeeServices(value.adminFeeServices);
        setAdminFeeServicesPercent(value.adminFeeServicesPercent);
        setAdminFeeInsurance(value.adminFeeInsurance);
        setAdminFeeInsurancePercent(value.adminFeeInsurancePercent);
        setPremiInsurancePercent(value.premiInsurancePercent);
        setPremiInsurance(value.premiInsurance);
        setCostPerKilometer(value.costPerKilometer);
        setPaymentPeriodExpired(value.paymentPeriodExpired);
        setCreatedBy(value.createdBy);
        setUpdatedBy(value.updatedBy);
    }

    const getCronjob = (_page, _perPage, searchText) => {
        axios({
            url: `/setting/cronjob?page=${_page}&size=${_perPage}&search=${searchText}`,
            method: 'get',
        })
            .then((response) => {
                setCronjobList(response.data.result)
                setTotalRows(response.data.totalItems)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handlePageChange = (page) => {
        var _page = Number(page) - 1
        setPage(_page)
        getCronjob(_page, perPage, '')
    }

    const handlePerRowsChange = async (userPerPage, _page) => {
        setPerPage(userPerPage)
        getCronjob(page, userPerPage, '')
    }

    function openForm() {
        let permissionRole = rolePermission.find(
            (perm) => perm.permissionName.toLowerCase() === 'setting',
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
        }
    }

    const clickRow = (row, event) => {
        let permissionRole = rolePermission.find(
            (perm) => perm.permissionName.toLowerCase() === 'setting',
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
        }
    }

    function updateSeting() {
        if (hasNullSetting({
            adminFeeServices: adminFeeServices ? adminFeeServices : '',
            adminFeeServicesPercent: adminFeeServicesPercent,
            adminFeeInsurance: adminFeeInsurance ? adminFeeInsurance : '',
            adminFeeInsurancePercent: adminFeeInsurancePercent,
            paymentPeriodExpired: paymentPeriodExpired,
            costPerKilometer: costPerKilometer ? costPerKilometer : ''
        })) {
            handleClick()
            return
        }

        var data = {
            id: settingId,
            companyId: companyId,
            adminFeeServices: Number(adminFeeServices.toString().replace(/[^\d.-]/g, '')),
            adminFeeServicesPercent: adminFeeServicesPercent,
            adminFeeInsurance: Number(adminFeeInsurance.toString().replace(/[^\d.-]/g, '')),
            adminFeeInsurancePercent: adminFeeInsurancePercent,
            paymentPeriodExpired: paymentPeriodExpired,
            costPerKilometer: Number(costPerKilometer.toString().replace(/[^\d.-]/g, '')),
            createdBy: createdBy,
            updatedBy: userLogin.id
        }

        axios({
            url: '/setting/update-setting',
            method: 'put',
            data: data,
        })
            .then(() => {
                setVisible(false)
                getSetting()
                setAlertMsg(`berhasil memperbarui pengaturan`);
                handleClick();
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function addData() {
        var data = {
            id: cronjobId,
            purpose: purpose,
            type: type,
            everyDay: everyDay,
            valueCronjob: valueCronjob
        }

        if (hasNull({ purpose: purpose, valueCronjob: valueCronjob })) {
            handleClick()
            return
        }

        axios({
            url: '/setting/create-cronjob',
            method: 'post',
            data: data,
        })
            .then(() => {
                setVisible(false)
                getCronjob(page, perPage, '')
            })
            .catch((error) => {
                console.log(error)
                setAlertMessage(
                    error.response.data.message
                        ? error.response.data.message
                        : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
                )
                setAlertVisible(true)
            })
    }

    function saveData() {
        var data = {
            id: cronjobId,
            purpose: purpose,
            type: type,
            everyday: everyDay,
            value: valueCronjob
        }

        if (hasNull({ purpose: purpose, valueCronjob: valueCronjob })) {
            handleClick()
            return
        }

        axios({
            url: '/setting/update-cronjob',
            method: 'put',
            data: data,
        })
            .then(() => {
                setVisible(false)
                getCronjob(page, perPage, '')
            })
            .catch((error) => {
                console.log(error)
                setAlertMessage(
                    error.response.data.message
                        ? error.response.data.message
                        : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
                )
                setAlertVisible(true)
            })
    }

    function search(event) {
        getCronjob(page, perPage, event.toLowerCase())
    }

    function defaultValue() {
        setCronjobId('')
        setPurpose('')
        setType('')
        setEveryDay(false)
        setCreatedBy('')
        setUpdatedBy('')
        setValueCronjob('')
        setAlertVisible(false)
        setAlertMessage('')
        setVisible(false)
        setAlertRoleVisible(false)
    }

    function setValue(value) {
        setCronjobId(value.id)
        setPurpose(value.purpose)
        setType(value.type)
        setEveryDay(value.everyday)
        setValueCronjob(value.value)
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

    const hasNullSetting = (target) => {
        for (var value in target) {
            if (target[value] === '' || target[value] === null) {
                switch (value) {
                    case 'adminFeeServices':
                        setAlertMsg(`harap masukkan biaya admin layanan`)
                        break
                    case 'adminFeeServicesPercent':
                        setAlertMsg(`harap masukkan biaya admin layanan (dalam satuan persen)`)
                        break

                    case 'adminFeeInsurance':
                        setAlertMsg(`harap masukkan biaya admin asuransi`)
                        break

                    case 'adminFeeInsurancePercent':
                        setAlertMsg(`harap masukkan biaya admin asuransi (dalam satuan persen)`)
                        break

                    case 'paymentPeriodExpired':
                        setAlertMsg(`harap masukkan nilai berapa lama waktu pembayaran berakhir (dalam hitungan menit)`)
                        break

                    case 'costPerKilometer':
                        setAlertMsg(`harap masukkan rekomendasi biaya per kilometer`)
                        break

                    default:
                        break
                }
                return true
            }
        }
        return false
    }

    const hasNull = (target) => {
        for (var value in target) {
            if (target[value] === '' || target[value] === null) {
                switch (value) {
                    case 'purpose':
                        setAlertMsg(`harap pilih nama cronjob`)
                        break
                    case 'valueCronjob':
                        setAlertMsg(`harap tentukan nilai berapa hari untuk cronjob`)
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
    let findPage = findConfigPage.items.find((e) => e.name.toLowerCase() === 'setting')

    if (findPage && user.status === "active") {
        settingComponentData = (
            <div>
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

                <div>
                    <CRow>
                        <CCol>
                            <CCard style={{ background: '#00BBFF', color: '#FFFFFF' }}>
                                <CCardHeader>
                                    Pengaturan
                                </CCardHeader>
                                <CCardBody>
                                    <CForm>
                                        <CRow>
                                            <Stack lineHeight={lineHeight}>
                                                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                    <NumericFormat
                                                        id="input-prop"
                                                        disableUnderline
                                                        type="text"
                                                        placeholder="biaya admin layanan"
                                                        variant="standard"
                                                        value={adminFeeServices}
                                                        thousandSeparator=","
                                                        prefix={'Rp '}
                                                        fullWidth
                                                        customInput={Input}
                                                        onChange={(e) => setAdminFeeServices(e.target.value)}
                                                        inputProps={
                                                            {
                                                                style: {
                                                                    color: "#FFFFFF",
                                                                    fontSize: fontSize,
                                                                    borderBottom: adminFeeServices ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                                }
                                                            }
                                                        }
                                                    />
                                                </CCol>
                                            </Stack>
                                        </CRow>

                                        <CRow>
                                            <Stack lineHeight={lineHeight}>
                                                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                    <NumericFormat
                                                        id="input-prop"
                                                        disableUnderline
                                                        type="text"
                                                        placeholder="biaya admin layanan (%)"
                                                        variant="standard"
                                                        value={adminFeeServicesPercent}
                                                        fullWidth
                                                        customInput={Input}
                                                        onChange={(e) => setAdminFeeServicesPercent(e.target.value)}
                                                        inputProps={
                                                            {
                                                                style: {
                                                                    color: "#FFFFFF",
                                                                    fontSize: fontSize,
                                                                    borderBottom: adminFeeServicesPercent ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                                }
                                                            }
                                                        }
                                                    />
                                                </CCol>
                                            </Stack>
                                        </CRow>

                                        <CRow>
                                            <Stack lineHeight={lineHeight}>
                                                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                    <NumericFormat
                                                        id="input-prop"
                                                        disableUnderline
                                                        type="text"
                                                        placeholder="biaya admin asuransi"
                                                        variant="standard"
                                                        value={adminFeeInsurance}
                                                        thousandSeparator=","
                                                        prefix={'Rp '}
                                                        fullWidth
                                                        customInput={Input}
                                                        onChange={(e) => setAdminFeeInsurance(e.target.value)}
                                                        inputProps={
                                                            {
                                                                style: {
                                                                    color: "#FFFFFF",
                                                                    fontSize: fontSize,
                                                                    borderBottom: adminFeeInsurance ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                                }
                                                            }
                                                        }
                                                    />
                                                </CCol>
                                            </Stack>
                                        </CRow>

                                        <CRow>
                                            <Stack lineHeight={lineHeight}>
                                                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                    <NumericFormat
                                                        id="input-prop"
                                                        disableUnderline
                                                        type="text"
                                                        placeholder="biaya admin asuransi (%)"
                                                        variant="standard"
                                                        value={adminFeeInsurancePercent}
                                                        fullWidth
                                                        customInput={Input}
                                                        onChange={(e) => setAdminFeeInsurancePercent(e.target.value)}
                                                        inputProps={
                                                            {
                                                                style: {
                                                                    color: "#FFFFFF",
                                                                    fontSize: fontSize,
                                                                    borderBottom: adminFeeInsurancePercent ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                                }
                                                            }
                                                        }
                                                    />
                                                </CCol>
                                            </Stack>
                                        </CRow>

                                        <CRow>
                                            <Stack lineHeight={lineHeight}>
                                                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                    <NumericFormat
                                                        id="input-prop"
                                                        disableUnderline
                                                        type="text"
                                                        placeholder="periode pembayaran berakhir (menit)"
                                                        variant="standard"
                                                        value={paymentPeriodExpired}
                                                        fullWidth
                                                        customInput={Input}
                                                        onChange={(e) => setPaymentPeriodExpired(e.target.value)}
                                                        inputProps={
                                                            {
                                                                style: {
                                                                    color: "#FFFFFF",
                                                                    fontSize: fontSize,
                                                                    borderBottom: paymentPeriodExpired ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                                }
                                                            }
                                                        }
                                                    />
                                                </CCol>
                                            </Stack>
                                        </CRow>

                                        <CRow>
                                            <Stack lineHeight={lineHeight}>
                                                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                    <NumericFormat
                                                        id="input-prop"
                                                        disableUnderline
                                                        type="text"
                                                        placeholder="rekomendasi biaya per kilometer"
                                                        variant="standard"
                                                        value={costPerKilometer}
                                                        thousandSeparator=","
                                                        prefix={'Rp '}
                                                        fullWidth
                                                        customInput={Input}
                                                        onChange={(e) => setCostPerKilometer(e.target.value)}
                                                        inputProps={
                                                            {
                                                                style: {
                                                                    color: "#FFFFFF",
                                                                    fontSize: fontSize,
                                                                    borderBottom: costPerKilometer ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                                }
                                                            }
                                                        }
                                                    />
                                                </CCol>
                                            </Stack>
                                        </CRow>

                                    </CForm>
                                </CCardBody>

                                <CCardFooter style={{ background: '#00BBFF', color: '#FFFFFF' }}>
                                    <CRow>
                                        <CCol>
                                            <CButton
                                                onClick={updateSeting}
                                                style={{
                                                    height: 50,
                                                    width: "100%",
                                                    fontSize: fontSize,
                                                    background: '#FEFA1D',
                                                    color: '#000000',
                                                    border: 'none'
                                                }}>
                                                simpan pengaturan
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                </CCardFooter>
                            </CCard>
                        </CCol>
                    </CRow>
                </div>
                <br />
                <br />

                <div>
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
                                                <b>Cronjob</b>
                                            </h5>
                                        </CCol>
                                        <CCol xs="auto">
                                            <CButton
                                                style={{
                                                    width: "290px",
                                                    fontSize: 18,
                                                    background: '#00BBFF',
                                                    color: '#FFFFFF',
                                                    border: 'none'
                                                }}
                                                onClick={openForm}>
                                                tambah cronjob
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                <CCardBody>
                                    <CFormInput
                                        type="text"
                                        placeholder="Cari..."
                                        onKeyUp={(e) => search(e.target.value)}
                                    />
                                    <br></br>
                                    <DataTable
                                        columns={columns}
                                        data={cronjobList}
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
                            >
                                {alertMessage}
                            </CAlert>
                            <CModalHeader style={{ background: '#00BBFF', color: '#FFFFFF' }} closeButton={false}>
                                <CModalTitle>{pageType === 'new' ? 'tambah cronjob' : purpose}</CModalTitle>
                            </CModalHeader>
                            <CModalBody style={{ background: '#00BBFF' }}>
                                <CForm>

                                    <CRow>
                                        <Stack lineHeight={1}>
                                            <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                <CFormSelect
                                                    aria-label="addressprovince"
                                                    id="addressprovince"
                                                    placeholder="nama"
                                                    options={[
                                                        { label: 'nama', value: '' },
                                                        { label: 'KIR', value: 'KIR' },
                                                        { label: 'STNK', value: 'STNK' },
                                                    ]}
                                                    onChange={(e) => setPurpose(e.target.value)}
                                                    value={purpose}
                                                    style={{
                                                        fontSize: fontSize,
                                                        backgroundColor: '#00BBFF',
                                                        color: purpose ? '#FFFFFF' : '#FEFA1D',
                                                        borderTop: 'hidden',
                                                        borderLeft: 'hidden',
                                                        borderRight: 'hidden',
                                                        borderBottom: purpose ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                    }}
                                                />
                                            </CCol>
                                        </Stack>
                                    </CRow>

                                    <CRow>
                                        <Stack lineHeight={lineHeight}>
                                            <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                                <NumericFormat
                                                    id="input-prop"
                                                    value={valueCronjob}
                                                    placeholder="jalankan ketika (hari)"
                                                    customInput={Input}
                                                    fullWidth
                                                    disableUnderline
                                                    inputProps={
                                                        {
                                                            style: {
                                                                color: "#FFFFFF",
                                                                fontSize: fontSize,
                                                                borderBottom: valueCronjob ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                            }
                                                        }
                                                    }
                                                    onChange={(e) => setValueCronjob(e.target.value)}
                                                />
                                            </CCol>
                                        </Stack>
                                    </CRow>
                                    < br />
                                    <CRow>
                                        <CCol xs={9}>
                                            <div style={{ position: "relative", left: "5%", color: "#FFFFFF", fontSize: fontSize }}>
                                                <CFormCheck
                                                    id="flexCheckChecked"
                                                    label="setiap hari ?"
                                                    defaultChecked={everyDay}
                                                    onChange={(e) => setEveryDay(e.target.checked)}
                                                />
                                            </div>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CModalBody>

                            <CModalFooter style={{ background: '#00BBFF' }}>

                                <CButton hidden={pageType === 'edit'}
                                    onClick={addData}
                                    style={{
                                        height: 50,
                                        width: "100%",
                                        fontSize: fontSize,
                                        background: '#FEFA1D',
                                        color: '#000000',
                                        border: 'none'
                                    }}>
                                    tambah data
                                </CButton>

                                <CButton hidden={pageType === 'new'}
                                    onClick={saveData}
                                    style={{
                                        height: 50,
                                        width: "100%",
                                        fontSize: fontSize,
                                        background: '#FEFA1D',
                                        color: '#000000',
                                        border: 'none'
                                    }}>
                                    simpan data
                                </CButton>

                                <CButton color="secondary" onClick={() => setVisible(false)}
                                    style={{
                                        height: 50,
                                        width: "100%",
                                        fontSize: fontSize,
                                        background: '#FF0000',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}>tutup</CButton>
                            </CModalFooter>
                        </CModal>
                    </CRow>
                </div>
                < br />
                < br />
                < br />
            </div>
        )
    } else {
        settingComponentData = (
            <CRow>
                <CCard className="mb-4">
                    <CCardBody>
                        <div>
                            <div
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <span>Maaf..</span>
                                <br></br>
                                <span style={{ color: 'red' }}>
                                    <b>anda tidak memiliki akses !</b>
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

    return settingComponentData
}

export default Setting
