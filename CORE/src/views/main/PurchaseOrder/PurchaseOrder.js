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
    CAlert,
    CFormSelect,
    CTable,
    CTableHead,
    CTableBody,
    CTableDataCell,
    CTableRow,
    CTableHeaderCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react'

import axios from '../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import defaultImage from '../../../assets/boss.png'
import moment from 'moment'

import background from '../../../assets/bg2.png'
import { toBase64, validate, uploadMultipleDocument, randomNumbersLetters } from '../../../services/Util.Service'

import './style.scss'
import Snackbar from '@mui/material/Snackbar'
import 'react-phone-number-input/style.css'

import { PermissionModel } from '../../../models/Permission.model'
import { User } from '../../../models/user.class'
import { Stack } from '@mui/system'
import { Input, LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { NumericFormat } from 'react-number-format'

import LayoutService from '../../../services/Layout.Service'
import { useNavigate } from 'react-router-dom'

const PurchaseOrder = () => {
    var componenData;
    const { t } = useTranslation();
    const naviage = useNavigate()
    const userLogin = new User(useSelector((state) => state.user))
    const navigationList = useSelector((state) => state.navigation)
    const rolePermission = useSelector((state) => state.role.permissions)
    const rolePermissionPurchaseOrder = new PermissionModel(
        rolePermission.find((perm) => perm.permissionName?.toLowerCase().replace(/\s+/g, "") === 'addstock'),
    )
    let user = new User(useSelector((state) => state.user))
    const companyId = useSelector((state) => state.companyId)
    var [purchaseOrderList, setPurchaseOrderList] = useState(new Array())
    const [visible, setVisible] = useState(false)

    const componentRef = useRef();

    // Alert
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [alertRoleVisible, setAlertRoleVisible] = useState(false)
    const [alertRole, setAlerRole] = useState('')

    const [pageType, setPageType] = useState('new')

    // Pagination Data Purchase Order
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [searchText, setSearchText] = useState("")

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)

    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    const [loading, setLoading] = React.useState(false);

    const inputFile = useRef(null)

    // Init load
    useEffect(() => {
        setSearchText('')
        getPurchaseOrders(page, perPage, searchText);
        defaultValue();
        setLoading(false);
        // generateDate()
    }, [])

    const generateDate = () => {
        let now = new Date();
        let dateTimeNow = moment().format("YYYY-MM-DDTHH:mm:ss")
        let dateStart = moment().set({
            years: now.getFullYear(),
            months: now.getMonth(),
            dates: now.getDate(),
            hours: 0,
            minute: 0,
            seconds: 0
        }).toISOString()

        let dateEnd = moment().set({
            years: now.getFullYear(),
            months: now.getMonth(),
            dates: now.getDate(),
            hours: 23,
            minute: 59,
            seconds: 59
        }).toISOString()

        let convertMomentStart = moment(dateStart).toString()
        let convertMomentEnd = moment(dateEnd).toString()

        console.log({
            dateTimeNow, dateStart, dateEnd, convertMomentStart, convertMomentEnd
        })
    }

    const columns = [
        {
            name: 'invoince',
            selector: (row) => row.invoiceNumber,
            sortable: true,
        },
        {
            name: 'tanggal',
            selector: (row) => moment(row.date).format("DD/MM/YYYY"),
            sortable: true,
        },
        {
            name: 'total quantity',
            selector: (row) => row.totalQuantity,
            sortable: true,
        },
        {
            name: 'total item',
            selector: (row) => row.totalItem,
            sortable: true,
        },
        {
            name: 'total harga',
            selector: (row) => `IDR ${numeral(row.totalPrice).format("0,0")}`,
            sortable: true,
        }
    ]

    const getPurchaseOrders = (_page, _perPage, searchText) => {
        axios({
            url: `/transaction/purchase-order?page=${_page}&size=${_perPage}&search=${searchText}`
        }).then((response) => {
            setPurchaseOrderList(response.data.result)
            setTotalRows(response.data.totalItems)
        }).catch((error) => {
            //
        })
    }

    const handlePageChange = (page) => {
        var _page = Number(page) - 1
        setPage(_page)
        getPurchaseOrders(_page, perPage, searchText)
    }

    const handlePerRowsChange = async (usePerPage, _page) => {
        setPerPage(usePerPage)
        getPurchaseOrders(page, usePerPage, searchText)
    }

    async function openForm() {
        if (rolePermissionPurchaseOrder.permissionCreate) {
            naviage('/purchase-order/new')
        } else {
            setAlertRoleVisible(true)
            setAlerRole(`Sorry... You don't have access !`)
        }
    }

    const clickRow = async (row, event) => {
        if (rolePermissionPurchaseOrder.permissionEdit) {
            naviage(`/purchase-order/${row.id}`)
        } else {
            setAlertRoleVisible(true)
            setAlerRole(`Sorry... You don't have access !`)
        }
    }

    function GetById(id) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/transaction/purchase-order/${id}`
            }).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(error)
            })
        })
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
                    case 'name':
                        setAlertMsg(`Nama harus di isi`)
                        break
                    case 'code':
                        setAlertMsg(`Kode harus di isi`)
                        break
                    case 'sku':
                        setAlertMsg(`Sku harus di isi`)
                        break
                    case 'category':
                        setAlertMsg(`Harap pilih kategory`)
                        break
                    case 'unit':
                        setAlertMsg(`Harap pilih unit`)
                        break
                    case 'purchasePrice':
                        setAlertMsg(`Harga beli harus di isi`)
                        break
                    case 'sellingPrice':
                        setAlertMsg(`Harga Jual harus di isi`)
                        break
                    case 'minQuantity':
                        setAlertMsg(`Min. quantity harus di isi`)
                        break

                    default:
                        break
                }
                return true
            }
        }
        return false
    }


    function search(value) {
        setSearchText(value);
        getPurchaseOrders(page, perPage, value.toLowerCase())
    }

    function defaultValue() {

    }

    function setValue(value) {

    }

    let findConfigPage = navigationList.find((e) => e.name.toLowerCase().replace(/\s+/g, "") === 'managestock')
    let findPage = findConfigPage.items.find((e) => e.name.toLowerCase().replace(/\s+/g, "") === 'stock')

    if (findPage && user.status === "active") {
        componenData = (
            <>
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
                                            <b>Pembelian Stok</b>
                                        </h5>
                                    </CCol>
                                    <CCol xs="auto">
                                        <CButton
                                            style={{
                                                background: '#00BBFF',
                                                color: '#FFFFFF',
                                                border: 'none'
                                            }}
                                            onClick={() => openForm()}>
                                            Tambah Pembelian Stok
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CCardHeader>
                            <CCardBody>
                                <CFormInput
                                    type="text"
                                    placeholder="Cari......"
                                    onKeyUp={(e) => search(e.target.value)}
                                />
                                <br></br>
                                <DataTable
                                    columns={columns}
                                    data={purchaseOrderList}
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
                </CRow>
            </>
        )
    } else {
        componenData = (
            <CRow>
                <CCard className="mb-4">
                    <CCardBody>
                        <div>
                            <div
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <span>{t('sorry')}...</span>
                                <br></br>
                                <span style={{ color: 'red' }}>
                                    <b>{t('dont_have_access')} !</b>
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

    return componenData
}

export default PurchaseOrder
