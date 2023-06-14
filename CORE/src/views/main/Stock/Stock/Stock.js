import React, { useState, useEffect } from 'react'

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CFormInput
} from '@coreui/react'

import axios from '../../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'

import background from '../../../../assets/bg2.png'

import './style.scss'
import { User } from '../../../../models/user.class'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'

import LayoutService from '../../../../services/Layout.Service'

const Stock = () => {
    var componenData;
    const { t } = useTranslation();
    const navigationList = useSelector((state) => state.navigation)
    let user = new User(useSelector((state) => state.user))
    var [productList, setProductList] = useState(new Array())

    // Pagination Data
    const [pageType, setPageType] = useState('new')
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [searchText, setSearchText] = useState("")

    // Init load
    useEffect(() => {
        setSearchText("");
        getProducts(page, perPage, searchText);
    }, [])

    const columns = [
        {
            name: t('name'),
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: t('code'),
            selector: (row) => row.code,
            sortable: true,
        },
        {
            name: t('category'),
            selector: (row) => row.category,
            sortable: true,
        },
        {
            name: t('unit'),
            selector: (row) => row.unit,
            sortable: true,
        },
        {
            name: 'masuk',
            selector: (row) => row.incomingQuantity,
            cell: (row) => <div style={{color: 'blue', fontWeight: 'bold'}}>{row.incomingQuantity}</div>,
            sortable: true,
            center: true
        },
        {
            name: t('terjual'),
            selector: (row) => row.quantitySold,
            cell: (row) => <div style={{color: 'orange', fontWeight: 'bold'}}>{row.quantitySold}</div>,
            sortable: true,
            center: true
        },
        {
            name: t('terbuang'),
            selector: (row) => row.quantityOut,
            cell: (row) => <div style={{color: 'red', fontWeight: 'bold'}}>{row.quantityOut}</div>,
            sortable: true,
            center: true
        },
        {
            name: t('balance'),
            selector: (row) => row.differenceQuantity,
            cell: (row) => <div style={{color: 'green', fontWeight: 'bold'}}>{row.differenceQuantity}</div>,
            sortable: true,
            center: true
        }
    ]

    const getProducts = (_page, _perPage, searchText) => {
        axios({
            url: `/stock?page=${_page}&size=${_perPage}&search=${searchText}`
        }).then((response) => {
            setProductList(response.data.result)
            setTotalRows(response.data.totalItems)
        }).catch((error) => {
            //
        })
    }

    const handlePageChange = (page) => {
        var _page = Number(page) - 1
        setPage(_page)
        getProducts(_page, perPage, searchText)
    }

    const handlePerRowsChange = async (userPerPage, _page) => {
        setPerPage(userPerPage)
        getProducts(page, userPerPage, searchText)
    }

    function search(event) {
        setSearchText(value);
        getProducts(page, perPage, event.toLowerCase())
    }

    let findConfigPage = navigationList.find((e) => e.name.toLowerCase().replace(/\s+/g, "") === 'managestock')
    let findPage = findConfigPage.items.find((e) => e.name.toLowerCase().replace(/\s+/g, "") === 'stock')

    if (findPage && user.status === "active") {
        componenData = (
            <>
                <CRow>
                    <CCol xs>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <CRow className="justify-content-between">
                                    <CCol xs="auto" className="me-auto">
                                        <h5>
                                            <b>Daftar Stok</b>
                                        </h5>
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
                                    data={productList}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    onChangePage={handlePageChange}
                                    onChangeRowsPerPage={handlePerRowsChange}
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

export default Stock
