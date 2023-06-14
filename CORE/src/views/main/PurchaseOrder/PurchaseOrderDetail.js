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
    CBadge,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react'

import axios from '../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import moment from 'moment'

import background from '../../../assets/bg2.png'
import { randomNumbersLetters } from '../../../services/Util.Service'

import './style.scss'
import Snackbar from '@mui/material/Snackbar'
import 'react-phone-number-input/style.css'

import { PermissionModel } from '../../../models/Permission.model'
import { User } from '../../../models/user.class'
import { Backdrop, CircularProgress, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'

import LayoutService from '../../../services/Layout.Service'
import { useNavigate, useParams } from 'react-router-dom'
import { PurchaseOrderClass } from '../../../models/transaction.class'
import { PurchaseOrderResults, PurchaseProductClass } from '../../../models/product.class'
import { cilArrowThickFromRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const PurchaseOrderDetail = () => {
    let { id } = useParams();
    var componenData;
    const { t } = useTranslation();
    const navigate = useNavigate()
    const userLogin = new User(useSelector((state) => state.user))
    const navigationList = useSelector((state) => state.navigation)
    const rolePermission = useSelector((state) => state.role.permissions)
    const rolePermissionPurchaseOrder = new PermissionModel(
        rolePermission.find((perm) => perm.permissionName?.toLowerCase().replace(/\s+/g, "") === 'addstock'),
    )
    const companyId = useSelector((state) => state.companyId)

    let [productList, setProductList] = useState(new Array());
    let [productListSelected, setProductListSelected] = useState(new Array());
    let [selectedRowProduct, setSelectedRowProduct] = useState(new Array());
    let [supplierList, setSupplierList] = useState(new Array());

    let [purchaseOrderData, setPurchaseOrderData] = useState(new PurchaseOrderClass());
    let [purchaseProductData, setPurchaseProductData] = useState(new PurchaseOrderResults());

    const [supplierSelected, setSupplierSelected] = useState(null);

    const [pageType, setPageType] = useState('')
    const [totalRowsProducts, setTotalRowsProducts] = useState(0)
    const [perPageProducts, setPerPageProducts] = useState(10)
    const [pageProducts, setPageProducts] = useState(0)
    const [searchTextProduct, setSearchTextProduct] = useState('')

    const [totalRowsSupplier, setTotalRowsSupplier] = useState(0)
    const [perPageSupplier, setPerPageSupplier] = useState(10)
    const [pageSupplier, setPageSupplier] = useState(0)
    const [searchTextSupplier, setSearchTextSupplier] = useState('')

    const [visibleModalProduct, setVisibleModalProduct] = useState(false);
    const [visibleModalSupplier, setVisibleModalSupplier] = useState(false)

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)

    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    const [loading, setLoading] = useState(false);

    // Init load
    useEffect(() => {
        setSelectedRowProduct(new Array());
        setProductListSelected(new Array());
        setProductList(new Array());
        setSupplierList(new Array());
        setPurchaseOrderData(new PurchaseOrderClass());
        setPurchaseProductData(new PurchaseOrderResults());
        setSearchTextProduct('');
        setSearchTextSupplier('');
        setVisibleModalProduct(false);
        setVisibleModalSupplier(false);
        setLoading(false);
        setSupplierSelected(null);

        initializePage();
    }, [])

    const initializePage = async () => {

        if (id && id === 'new') {
            initializeData();
            setPageType('new')
            getProducts(pageProducts, perPageProducts, searchTextProduct);
            getSuppliers(pageSupplier, perPageSupplier, searchTextSupplier);
        } else {
            try {
                let _getPurchaseOrder = await getPurchaseOrders();
                if (_getPurchaseOrder.data && _getPurchaseOrder.data?.message === 'success') {
                    setPageType('detail');
                    setPurchaseProductData(new PurchaseOrderResults(_getPurchaseOrder.data))
                    let data = new PurchaseOrderResults(_getPurchaseOrder.data);
                } else {
                    navigate('/purchase-order')
                }
            } catch (error) {
                console.log(error)
                navigate('/purchase-order')
            }
        }
    }

    const initializeData = () => {
        let data = new PurchaseOrderClass();
        data.date = new Date();
        data.invoiceNumber = `INV/${randomNumbersLetters(7)}/${new Date().getTime().toString().slice(5)}`;
        data.userId = userLogin?.id;
        data.createdBy = userLogin.id;

        setPurchaseOrderData(data)
    }

    function getPurchaseOrders() {
        return axios({
            url: `/transaction/purchase-order/${id}`
        })
    }

    function addData() {

        if (purchaseOrderData.supplierId === null) {
            setAlertMsg('Harap pilih supplier');
            handleClick();
            return;
        }

        if (productListSelected.length === 0) {
            setAlertMsg('Belum ada produk yang dipilih');
            handleClick();
            return;
        }

        let filterProduct = productListSelected.filter((p) => p.quantityForPurchase === 0 || p.totalPriceForPurchase === 0);
        if (filterProduct.length > 0) {
            setAlertMsg('Quantity pada produk tidak boleh nol (0) !');
            handleClick();
            return;
        }

        setPurchaseOrderData

        let purchaseProducts = new Array();
        productListSelected.map((item) => {
            let purchaseProduct = new PurchaseProductClass();

            purchaseProduct.createdBy = userLogin.id;
            purchaseProduct.date = new Date();
            purchaseProduct.productId = item.id;
            purchaseProduct.totalPrice = item.totalPriceForPurchase;
            purchaseProduct.totalQuantity = item.quantityForPurchase;

            purchaseProducts.push(purchaseProduct)
        });

        purchaseOrderData.totalPrice = Number(purchaseOrderData.totalPrice.toString().replace(/[^\d.-]/g, ''))
        let data = {
            purchaseOrder: purchaseOrderData,
            purchaseProducts: purchaseProducts
        }

        setLoading(true);

        axios({
            url: '/transaction/purchase-order/new',
            method: 'POST',
            data: data
        }).then((response) => {
            setLoading(false)
            setAlertMsg('Berhasil menambah data pembelian produk')
            handleClick();
            setTimeout(() => {
                navigate('/purchase-order')
            }, 3000);
        }).catch((error) => {
            setLoading(false)
            setAlertMsg(error.response.data.message ? error.response.data.message : 'Terjadi kesalahan !')
            handleClick()
        });
    }


    /**
     * =============================================================================================
     * #Region Products Handling
     * =============================================================================================
     */
    const columnProducts = [
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
            name: 'quantity',
            selector: (row) => row.quantity,
            sortable: true,
        }
    ]

    const getProducts = (_page, _perPage, _searchText) => {
        axios({
            url: `/product?page=${_page}&size=${_perPage}&search=${_searchText}`
        }).then((response) => {
            setProductList(response.data.result);
            setTotalRowsProducts(response.data.totalItems);
        }).catch((error) => {
            //
        })
    }

    const handlePageChangeProduct = (page) => {
        var _page = Number(page) - 1
        setPageProducts(_page)
        getProducts(_page, perPageProducts, searchText)
    }

    const handlePerRowsChangeProduct = async (usePerPage, _page) => {
        setPerPageProducts(usePerPage)
        getProducts(pageProducts, usePerPage, searchText)
    }

    const clickRowProduct = async (row, event) => {

    }

    const handleSelectedProduct = ({ selectedRows }) => {
        setSelectedRowProduct(selectedRows)
    };

    function searchProduct(event) {
        setSearchTextProduct(event.toLowerCase());
        getProducts(pageProducts, perPageProducts, event.toLowerCase())
    }

    const handleChangeProductSelected = () => {
        if (selectedRowProduct.length > 0) {
            let data = new Array();
            if (productListSelected.length > 0) {
                productListSelected.forEach((item) => {
                    data.push(item);
                })
            }

            selectedRowProduct.map((item, index) => {

                let findProduct = data.find((p) => p.id === item.id);
                if (findProduct) {
                    findProduct.quantityForPurchase += 1
                    findProduct.totalPriceForPurchase = findProduct.purchasePrice * findProduct.quantityForPurchase;
                } else {
                    data.push(item);
                }

                if (index === (selectedRowProduct.length - 1)) {
                    setProductListSelected(data);
                    calculationPurchaseOrder(data);
                    setVisibleModalProduct(false);
                    setSelectedRowProduct(new Array());

                    setTimeout(() => {
                        setVisibleModalProduct(false)
                    }, 200);
                }
            })
        } else {
            setVisibleModalProduct(false)
        }
    }
    /**
     * =============================================================================================
     * #Endregion Products Handling
     * =============================================================================================
     */





    /**
     * =============================================================================================
     * #Region Supplier Handling
     * =============================================================================================
     */
    const columnSupplier = [
        {
            name: t('photo'),
            selector: (row) => <img src={row.photoUrl} width={40} alt="photo"></img>,
            width: '100px',
        },
        {
            name: t('name'),
            selector: (row) => row.fullName,
            sortable: true,
        },
        {
            name: t('email'),
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: t('phone_number'),
            selector: (row) => row.phoneNumber,
            sortable: true,
        }
    ]

    const getSuppliers = (_page, _perPage, _searchText) => {
        axios({
            url: `/supplier?page=${_page}&size=${_perPage}&search=${_searchText}`
        }).then((response) => {
            setSupplierList(response.data.result);
            setTotalRowsSupplier(response.data.totalItems);
        }).catch((error) => {
            //
        })
    }

    const handlePageChangeSupplier = (page) => {
        var _page = Number(page) - 1
        setPageSupplier(_page)
        getSuppliers(_page, perPageSupplier, searchText)
    }

    const handlePerRowsChangeSupplier = async (usePerPage, _page) => {
        setPerPageSupplier(usePerPage)
        getSuppliers(pageSupplier, usePerPage, searchText)
    }

    const clickRowSupplier = async (row, event) => {
        purchaseOrderData = new PurchaseOrderClass(purchaseOrderData);
        purchaseOrderData.supplierId = row.id;
        setPurchaseOrderData(purchaseOrderData);
        setSupplierSelected(row)
        setTimeout(() => {
            setVisibleModalSupplier(false)
        }, 300);
    }

    function searchSupplier(event) {
        setSearchTextSupplier(event.toLowerCase());
        getSuppliers(pageProducts, perPageProducts, event.toLowerCase())
    }
    /**
     * =============================================================================================
     * #Endregion Suppleir Handling
     * =============================================================================================
     */




    async function openForm() {
        if (rolePermissionPurchaseOrder.permissionCreate) {
            navigate('/purchase-order/new')
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

    function defaultValue() {

    }

    function setValue(value) {

    }

    function changeQuantity(value, item) {
        let changeQuantityValue = productListSelected.map((p) => {
            if (p.id === item.id) {
                p.quantityForPurchase = Number(value);
                p.totalPriceForPurchase = Number(p.purchasePrice) * Number(p.quantityForPurchase)
                return p;
            } else {
                return p;
            }
        })

        setPurchaseOrderData(purchaseOrderData)
        setProductListSelected(changeQuantityValue)
        calculationPurchaseOrder(changeQuantityValue);
    }

    function changePrice(value, item) {
        let changePriceValue = productListSelected.map((p) => {
            if (p.id === item.id) {
                p.purchasePrice = Number(value);
                p.totalPriceForPurchase = Number(p.purchasePrice) * Number(p.quantityForPurchase)
                return p;
            } else {
                return p;
            }
        })
        setProductListSelected(changePriceValue);
        calculationPurchaseOrder(changePriceValue);
    }

    function deleteItem(index, item) {
        const remove = productListSelected.filter((p) => p.id !== item.id)
        setProductListSelected(remove);
        calculationPurchaseOrder(remove)
    }

    function calculationPurchaseOrder(value) {
        purchaseOrderData.totalItem = 0;
        purchaseOrderData.totalPrice = 0;
        purchaseOrderData.totalQuantity = 0;

        value.map((item, index) => {
            purchaseOrderData.totalItem += 1;
            purchaseOrderData.totalPrice += Number(item.totalPriceForPurchase);
            purchaseOrderData.totalQuantity += Number(item.quantityForPurchase)
        })

        setPurchaseOrderData(purchaseOrderData);
    }

    let findConfigPage = navigationList.find((e) => e.name.toLowerCase().replace(/\s+/g, "") === 'managestock')
    let findPage = findConfigPage.items.find((e) => e.name.toLowerCase().replace(/\s+/g, "") === 'addstock')

    if (findPage && userLogin.status === "active") {
        componenData = (
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
                        visible={visibleModalProduct}
                        onClose={() => setVisibleModalProduct(false)}
                        size='lg'
                        backdrop="static"
                        scrollable>
                        <CModalHeader>
                            <CModalTitle>Pilih Produk</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormInput
                                type="text"
                                placeholder="Cari produk..."
                                id="form-input"
                                onChange={(e) => searchProduct(e.target.value)} />
                            <br></br>
                            <DataTable
                                columns={columnProducts}
                                data={productList}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRowsProducts}
                                onChangePage={handlePageChangeProduct}
                                onChangeRowsPerPage={handlePerRowsChangeProduct}
                                onRowClicked={clickRowProduct}
                                highlightOnHover
                                selectableRows
                                onSelectedRowsChange={handleSelectedProduct}
                                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                customStyles={LayoutService().customStylesDataTable()}
                            />
                        </CModalBody>
                        <CModalFooter>
                            <CButton onClick={() => handleChangeProductSelected()}
                                style={{
                                    background: '#00BBFF',
                                    color: '#FFFFFF',
                                    border: 'none'
                                }} className="position-relative">
                                Tambah Produk
                                <CBadge color="success" position="top-end" shape="rounded-pill">
                                    {selectedRowProduct.length}
                                </CBadge>
                            </CButton>
                            &nbsp;&nbsp;
                            <CButton style={{
                                background: '#FF0000',
                                color: '#FFFFFF',
                                border: 'none'
                            }}>{t('cancel')}
                            </CButton>
                        </CModalFooter>
                    </CModal>

                    <CModal
                        alignment="center"
                        visible={visibleModalSupplier}
                        onClose={() => setVisibleModalSupplier(false)}
                        size='lg'
                        backdrop="static"
                        scrollable>
                        <CModalHeader>
                            <CModalTitle>Pilih Pemasok</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormInput
                                type="text"
                                placeholder="Cari suplier..."
                                id="form-input"
                                onChange={(e) => searchSupplier(e.target.value)} />
                            <br></br>
                            <DataTable
                                columns={columnSupplier}
                                data={supplierList}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRowsSupplier}
                                onChangePage={handlePageChangeSupplier}
                                onChangeRowsPerPage={handlePerRowsChangeSupplier}
                                onRowClicked={clickRowSupplier}
                                highlightOnHover
                                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                customStyles={LayoutService().customStylesDataTable()}
                            />
                        </CModalBody>
                    </CModal>
                </CRow>

                <div>

                    {pageType === 'new'
                        ?
                        <>
                            <CRow>
                                <CCol className='content-purchase'>
                                    <CCard>
                                        <CCardHeader>
                                            <CRow className="justify-content-between">
                                                <CCol xs="auto" className="me-auto">
                                                    <h5>Pembelian Stok</h5>
                                                </CCol>
                                                <CCol xs="auto">
                                                    <CInputGroup className="mb-3">
                                                        <CInputGroupText
                                                            style={{ cursor: 'pointer', borderRight: 'none' }}
                                                            onClick={() => navigate('/purchase-order')}>
                                                            <CIcon icon={cilArrowThickFromRight} />
                                                        </CInputGroupText>
                                                        <CInputGroupText
                                                            style={{ cursor: 'pointer', borderLeft: 'none' }}
                                                            onClick={() => navigate('/purchase-order')}>
                                                            kembali
                                                        </CInputGroupText>&nbsp;&nbsp;
                                                        <CInputGroupText
                                                            style={{
                                                                background: '#00BBFF',
                                                                color: '#FFFFFF',
                                                                borderRadius: 6,
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => addData()}>
                                                            Tambah Pembelian Stok
                                                        </CInputGroupText>
                                                    </CInputGroup>
                                                </CCol>
                                            </CRow>
                                        </CCardHeader>

                                        <CCardBody>
                                            <CForm>
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Invoice"
                                                            variant="standard"
                                                            fullWidth
                                                            value={purchaseOrderData.invoiceNumber}
                                                            disabled
                                                        />
                                                    </CCol>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Tanggal"
                                                            variant="standard"
                                                            fullWidth
                                                            value={moment().format("DD/MM/YYYY")}
                                                            disabled
                                                        />
                                                    </CCol>
                                                </CRow> <br />
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Karyawan"
                                                            variant="standard"
                                                            fullWidth
                                                            value={userLogin?.fullName}
                                                            focused
                                                            inputProps={{
                                                                readOnly: true
                                                            }}
                                                        />
                                                    </CCol>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Supplier"
                                                            variant="standard"
                                                            fullWidth
                                                            onClick={() => setVisibleModalSupplier(true)}
                                                            value={supplierSelected ? supplierSelected?.fullName : ""}
                                                            focused
                                                            inputProps={{
                                                                readOnly: true
                                                            }}
                                                        />
                                                    </CCol>
                                                </CRow>

                                                <CRow>
                                                    <div className='container-table'>
                                                        <div className="table-data">
                                                            <table className="table1">
                                                                <tr className="header-cell">
                                                                    <th>No</th>
                                                                    <th>Nama</th>
                                                                    <th>Quantity</th>
                                                                    <th>Harga</th>
                                                                    <th>Total</th>
                                                                    <th>Aksi</th>
                                                                </tr>
                                                                {productListSelected &&
                                                                    productListSelected.length > 0
                                                                    ?
                                                                    <tbody>
                                                                        {productListSelected.map((item, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{index + 1}</td>
                                                                                    <td>{item?.name}</td>
                                                                                    <td>
                                                                                        <input type='tel'
                                                                                            style={{ border: '1px solid #c0c0c0', borderRadius: 3, height: 30 }}
                                                                                            value={item?.['quantityForPurchase']}
                                                                                            onChange={(e) => changeQuantity(e.target.value, item)} />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type='tel'
                                                                                            style={{ border: '1px solid #c0c0c0', borderRadius: 3, height: 30 }}
                                                                                            value={item?.['purchasePrice']}
                                                                                            onChange={(e) => changePrice(e.target.value, item)} />
                                                                                    </td>
                                                                                    <td>{numeral(item?.['totalPriceForPurchase']).format("0,0")}</td>
                                                                                    <td onClick={() => deleteItem(index, item)} style={{ cursor: 'pointer' }}><i className="fa fa-trash"></i></td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                    :
                                                                    <></>
                                                                }
                                                            </table>
                                                            {productListSelected &&
                                                                productListSelected.length > 0
                                                                ?
                                                                <></>
                                                                :
                                                                <div style={{ position: 'relative', height: 40 }}>
                                                                    <h6 style={{ position: 'relative', textAlign: 'center', top: 14 }}>Belum ada produk yang dipilih</h6>
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className="btn_add_product_outline" onClick={() => setVisibleModalProduct(true)}>
                                                            <h6>Tambah Produk</h6>
                                                        </div>
                                                    </div>
                                                </CRow>

                                                <div className='total-section'>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total Item
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            {purchaseOrderData.totalItem}
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total Quantity
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            {purchaseOrderData.totalQuantity}
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            Rp {numeral(purchaseOrderData.totalPrice).format("0,0")}
                                                        </CCol>
                                                    </CRow>
                                                </div>
                                            </CForm >
                                        </CCardBody >
                                    </CCard >
                                </CCol >
                            </CRow>
                        </>
                        :
                        <>
                            <CRow>
                                <CCol className='content-purchase'>
                                    <CCard>
                                        <CCardHeader>
                                            <CRow className="justify-content-between">
                                                <CCol xs="auto" className="me-auto">
                                                    <h5>Detail Pembelian Stok</h5>
                                                </CCol>
                                                <CCol xs="auto">
                                                    <CInputGroup className="mb-3"
                                                        style={{ cursor: 'pointer', borderRadius: 2 }}
                                                        onClick={() => navigate('/purchase-order')}>
                                                        <CInputGroupText>
                                                            <CIcon icon={cilArrowThickFromRight} />
                                                        </CInputGroupText>
                                                        <CInputGroupText
                                                            style={{
                                                                background: '#00BBFF',
                                                                color: '#FFFFFF'
                                                            }}>
                                                            kembali
                                                        </CInputGroupText>
                                                    </CInputGroup>
                                                </CCol>
                                            </CRow>
                                        </CCardHeader>

                                        <CCardBody>
                                            <CForm>
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Invoice"
                                                            variant="standard"
                                                            fullWidth
                                                            focused
                                                            value={purchaseProductData.purchaseOrder.invoiceNumber}
                                                            inputProps={{
                                                                readOnly: true
                                                            }}
                                                        />
                                                    </CCol>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Tanggal"
                                                            variant="standard"
                                                            fullWidth
                                                            focused
                                                            value={moment(purchaseProductData.purchaseOrder.date).format("DD/MM/YYYY")}
                                                            inputProps={{
                                                                readOnly: true
                                                            }}
                                                        />
                                                    </CCol>
                                                </CRow> <br />
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Karyawan"
                                                            variant="standard"
                                                            fullWidth
                                                            value={purchaseProductData.user.fullName ? purchaseProductData.user.fullName : purchaseProductData.user.firstName}
                                                            focused
                                                            inputProps={{
                                                                readOnly: true
                                                            }}
                                                        />
                                                    </CCol>
                                                    <CCol xs={6}>
                                                        <TextField
                                                            id="standard-basic"
                                                            label="Supplier"
                                                            variant="standard"
                                                            fullWidth
                                                            value={purchaseProductData.user.fullName ? purchaseProductData.user.fullName : purchaseProductData.user.firstName}
                                                            focused
                                                            inputProps={{
                                                                readOnly: true
                                                            }}
                                                        />
                                                    </CCol>
                                                </CRow>

                                                <CRow>
                                                    <div className='container-table'>
                                                        <div className="table-data">
                                                            <table className="table1">
                                                                <tr className="header-cell">
                                                                    <th>No</th>
                                                                    <th>Nama</th>
                                                                    <th>Quantity</th>
                                                                    <th>Harga</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                                <tbody>
                                                                    {purchaseProductData.purchaseOrder.purchaseProduct.map((item, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{item?.product?.name}</td>
                                                                                <td>{item?.totalQuantity}</td>
                                                                                <td>{Number(item?.totalPrice) / Number(item?.totalQuantity)}</td>
                                                                                <td>{numeral(item?.totalPrice).format("0,0")}</td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </CRow>

                                                <div className='total-section'>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total Item
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            {purchaseProductData.purchaseOrder.totalItem}
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total Quantity
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            {purchaseProductData.purchaseOrder.totalQuantity}
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            Rp {numeral(purchaseProductData.purchaseOrder.totalPrice).format("0,0")}
                                                        </CCol>
                                                    </CRow>
                                                </div>
                                            </CForm >
                                        </CCardBody >
                                    </CCard >
                                </CCol >
                            </CRow>
                        </>
                    }
                </div>
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

export default PurchaseOrderDetail
