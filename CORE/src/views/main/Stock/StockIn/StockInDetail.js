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

import axios from '../../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import moment from 'moment'

import background from '../../../../assets/bg2.png'
import { randomNumbersLetters } from '../../../../services/Util.Service'

import './style.scss'
import Snackbar from '@mui/material/Snackbar'
import 'react-phone-number-input/style.css'

import { PermissionModel } from '../../../../models/Permission.model'
import { User } from '../../../../models/user.class'
import { Backdrop, CircularProgress, MenuItem, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'

import LayoutService from '../../../../services/Layout.Service'
import { useNavigate, useParams } from 'react-router-dom'
import { PurchaseOrderResults, PurchaseProductClass } from '../../../../models/product.class'
import { cilArrowThickFromRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { StockInClass, StockInDetailClass } from '../../../../models/stock.class'


const StockInDetail = () => {
    let { id, type } = useParams();
    var componenData;
    const { t } = useTranslation();
    const navigate = useNavigate()
    const userLogin = new User(useSelector((state) => state.user))
    const navigationList = useSelector((state) => state.navigation)
    const rolePermission = useSelector((state) => state.role.permissions)
    const rolePermissionStockIn = new PermissionModel(
        rolePermission.find((perm) => perm.permissionName?.toLowerCase().replace(/\s+/g, "") === 'stockin'),
    )
    const companyId = useSelector((state) => state.companyId)

    let [productList, setProductList] = useState(new Array());
    let [productListSelected, setProductListSelected] = useState(new Array());
    let [productListSelectedFromPurchase, setProductListSelectedFromPurchase] = useState(new Array());
    let [selectedRowProduct, setSelectedRowProduct] = useState(new Array());
    let [selectedRowProductFromPurchase, setSelectedRowProductFromPurchase] = useState(new Array());

    let [stockInData, setStockInData] = useState(new StockInClass());
    let [stockInDetailData, setStockInDetailData] = useState(new StockInDetailClass());
    let [purchaseOrderList, setPurchaseOrderList] = useState(new Array());
    let [productListFromPurchase, setProductListFromPurchase] = useState(new Array());
    let [productResultFromPurchase, setProductResultFromPurchase] = useState(new Array());

    const [pageType, setPageType] = useState('')
    const [processType, setProcessType] = useState('')
    const [totalRowsProducts, setTotalRowsProducts] = useState(0)
    const [perPageProducts, setPerPageProducts] = useState(10)
    const [pageProducts, setPageProducts] = useState(0)
    const [searchTextProduct, setSearchTextProduct] = useState('')

    const [visibleModalProduct, setVisibleModalProduct] = useState(false);
    const [visibleModalProductFromPurchase, setVisibleModalProductFromPurchase] = useState(false);

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)

    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    const [loading, setLoading] = useState(false);

    // Init load
    useEffect(() => {

        console.log({
            id: id,
            type: type
        })

        setProductResultFromPurchase(new Array());
        setProductListSelectedFromPurchase(new Array());
        setSelectedRowProductFromPurchase(new Array());
        setProductListFromPurchase(new Array());
        setSelectedRowProduct(new Array());
        setProductListSelected(new Array());
        setProductList(new Array());
        setPurchaseOrderList(new Array());
        setStockInData(new StockInClass());
        setStockInDetailData(new StockInDetailClass());
        setSearchTextProduct('');
        setVisibleModalProduct(false);
        setLoading(false);

        initializePage();
        setProcessType(type)
    }, [])

    const initializePage = async () => {

        if (id && id === 'new') {
            initializeData();
            setPageType('new')
            getProducts(pageProducts, perPageProducts, searchTextProduct);
            getPurchaseOrder();
        } else {
            try {
                console.log(id)
                let _getStockInById = await getStockInById();
                console.log(_getStockInById)
                if (_getStockInById.data && _getStockInById.data?.message === 'success') {
                    setPageType('detail');
                    setStockInDetailData(new StockInDetailClass(_getStockInById.data));

                } else {
                    navigate('/stock-in')
                }
            } catch (error) {
                console.log(error)
                navigate('/stock-in')
            }
        }
    }

    const initializeData = () => {
        let data = new StockInClass();
        data.date = new Date();
        data.invoiceNumber = `INV/${randomNumbersLetters(7)}/${new Date().getTime().toString().slice(5)}`;
        data.userId = userLogin?.id;
        data.createdBy = userLogin.id;

        setStockInData(data)
        console.log(stockInData)
    }

    function getStockInById() {
        return axios({
            url: `/stock-in/${id}`
        })
    }

    function addData() {

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

        setStockInData

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

        stockInData.totalPrice = Number(stockInData.totalPrice.toString().replace(/[^\d.-]/g, ''))
        let data = {
            purchaseOrder: stockInData,
            purchaseProducts: purchaseProducts
        }

        setLoading(true);

        console.log(data)

        // axios({
        //     url: '/transaction/purchase-order/new',
        //     method: 'POST',
        //     data: data
        // }).then((response) => {
        //     setLoading(false)
        //     setAlertMsg('Berhasil menambah data pembelian produk')
        //     handleClick();
        //     setTimeout(() => {
        //         navigate('/purchase-order')
        //     }, 3000);
        // }).catch((error) => {
        //     setLoading(false)
        //     setAlertMsg(error.response.data.message ? error.response.data.message : 'Terjadi kesalahan !')
        //     handleClick()
        // });
    }

    const getPurchaseOrder = () => {
        axios({
            url: `/transaction/purchase-order/active`
        }).then((response) => {
            console.log(response);
            let data = [{ label: '-- no.pembelian order --', value: '' }];
            response.data.forEach((item) => {
                data.push({ label: item.invoiceNumber, value: item.id })
            });

            setPurchaseOrderList(data)
        }).catch((error) => {
            //
        })
    }


    /**
     * =============================================================================================
     * #Region Products Handling
     * =============================================================================================
     */
    const columnProductFromPurchase = [
        {
            name: 'nama',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'kode',
            selector: (row) => row.code,
            sortable: true,
        },
        {
            name: 'quantity',
            selector: (row) => row.totalQuantity,
            sortable: true,
        }
    ]

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

    const handleSelectedProductFromPurchase = ({ selectedRows }) => {
        setSelectedRowProductFromPurchase(selectedRows)
    };

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

    function handleChangeProductSelectedFromPurchase() {
        if (selectedRowProductFromPurchase.length > 0) {
            let data = new Array();
            if (productListSelectedFromPurchase.length > 0) {
                productListSelectedFromPurchase.forEach((item) => {
                    data.push(item);
                })
            }

            selectedRowProductFromPurchase.map((item, index) => {

                let findProduct = data.find((p) => p.id === item.id);
                if (findProduct) {
                    if (parseInt(findProduct.quantityForStockIn) < parseInt(findProduct.differenceQuantity)) {
                        findProduct.quantityForStockIn += 1
                        findProduct.totalPriceForStockIn = findProduct.sellingPrice * findProduct.quantityForStockIn;
                    }
                } else {
                    data.push(item);
                }

                if (index === (selectedRowProductFromPurchase.length - 1)) {
                    console.log(data)
                    setProductListSelectedFromPurchase(data);
                    calculationPurchaseOrder(data);
                    setSelectedRowProductFromPurchase(new Array());
                    setVisibleModalProductFromPurchase(false);
                }
            })
        }
    }
    /**
     * =============================================================================================
     * #Endregion Products Handling
     * =============================================================================================
     */


    async function openForm() {
        if (rolePermissionStockIn.permissionCreate) {
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

        setStockInData(stockInData)
        setProductListSelected(changeQuantityValue)
        calculationPurchaseOrder(changeQuantityValue);
    }

    function changeQuantityFromPurchase(value, item) {
        console.log({
            value: value,
            diff: item.differenceQuantity
        })
        if (parseInt(value) > item.differenceQuantity) {
            setAlertMsg('quantity tidak boleh melebih quantity yang di order')
            handleClick();
            return;
        }
        let changeQuantityValue = productListSelectedFromPurchase.map((p) => {
            if (p.id === item.id) {
                p.quantityForStockIn = Number(value);
                p.totalPriceForStockIn = Number(p.sellingPrice) * Number(p.quantityForStockIn)
                return p;
            } else {
                return p;
            }
        })

        setStockInData(stockInData)
        setProductListSelectedFromPurchase(changeQuantityValue)
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
        // const remove = productListSelected.filter((p) => p.id !== item.id)
        // setProductListSelected(remove);
        // calculationPurchaseOrder(remove)
    }

    function calculationPurchaseOrder(value) {
        console.log(value)
        stockInData.totalItem = 0;
        stockInData.totalPrice = 0;
        stockInData.totalQuantity = 0;

        value.map((item, index) => {
            stockInData.totalItem += 1;
            stockInData.totalPrice += Number(item.totalPriceForStockIn);
            stockInData.totalQuantity += Number(item.quantityForStockIn)
        })

        setStockInData(stockInData);
    }

    const selectPurchaseOrder = (row, event) => {
        console.log({ row, event })
        setStockInData({ purchaseOrderId: row?.target.value })
    }

    function addProductFormPurchase() {
        axios({
            url: `/transaction/purchase-order/${stockInData.purchaseOrderId}`
        }).then((response) => {
            console.log(response.data)
            let data = new PurchaseOrderResults(response.data);
            let product = new Array();
            data.purchaseOrder.purchaseProduct.map((item, index) => {
                product.push({
                    id: item.id,
                    date: item.date,
                    name: item.product.name,
                    code: item.product.code,
                    differenceQuantity: item.differenceQuantity,
                    productId: item.productId,
                    purchaseOrderId: item.purchaseOrderId,
                    quantityForStockIn: 0,
                    sellingPrice: parseInt(item.totalPrice) / parseFloat(item.totalQuantity),
                    totalPriceForStockIn: 0,
                    status: item.status,
                    totalDiscount: item.totalDiscount,
                    totalDiscountPercent: item.totalDiscountPercent,
                    totalPrice: item.totalPrice,
                    totalPriceAfterTax: item.totalPriceAfterTax,
                    totalQuantity: item.totalQuantity,
                    totalTax: item.totalTax,
                    transactionId: item.transactionId
                })

                if (index === (data.purchaseOrder.purchaseProduct.length - 1)) {
                    setProductResultFromPurchase(product)
                    setProductListFromPurchase(product)
                    setVisibleModalProductFromPurchase(true)
                }
            })
        })
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
                        size='lg'
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
                        visible={visibleModalProductFromPurchase}
                        size='lg'
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
                                columns={columnProductFromPurchase}
                                data={productListFromPurchase}
                                pagination
                                highlightOnHover
                                selectableRows
                                onSelectedRowsChange={handleSelectedProductFromPurchase}
                                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                customStyles={LayoutService().customStylesDataTable()}
                            />
                        </CModalBody>
                        <CModalFooter>
                            <CButton
                                onClick={() => handleChangeProductSelectedFromPurchase()}
                                style={{
                                    background: '#00BBFF',
                                    color: '#FFFFFF',
                                    border: 'none'
                                }} className="position-relative">
                                Tambah Produk
                                <CBadge color="success" position="top-end" shape="rounded-pill">
                                    {selectedRowProductFromPurchase.length}
                                </CBadge>
                            </CButton>
                            &nbsp;&nbsp;
                            <CButton style={{
                                background: '#FF0000',
                                color: '#FFFFFF',
                                border: 'none'
                            }}
                                onClick={() => setVisibleModalProductFromPurchase(false)}>{t('cancel')}
                            </CButton>
                        </CModalFooter>
                    </CModal>
                </CRow>

                <div>

                    {pageType === 'new'
                        ?

                        <>
                            {processType && processType === 'manual'
                                ?
                                <>
                                    <div>{processType}</div>
                                </>
                                :
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
                                                                    onClick={() => navigate('/stock-in')}>
                                                                    <CIcon icon={cilArrowThickFromRight} />
                                                                </CInputGroupText>
                                                                <CInputGroupText
                                                                    style={{ cursor: 'pointer', borderLeft: 'none' }}
                                                                    onClick={() => navigate('/stock-in')}>
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
                                                            <CCol xs={12} sm={6} lg={6} xl={6} xxl={6}>
                                                                <TextField
                                                                    id="standard-basic"
                                                                    label="Nomor"
                                                                    variant="standard"
                                                                    fullWidth
                                                                    value={stockInData.invoiceNumber}
                                                                    disabled
                                                                />
                                                            </CCol>
                                                            <CCol xs={12} sm={6} lg={6} xl={6} xxl={6}>
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
                                                            <CCol xs={12} sm={6} lg={6} xl={6} xxl={6}>
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
                                                            <CCol xs={12} sm={6} lg={6} xl={6} xxl={6}>
                                                                <TextField
                                                                    id="outlined-select-currency"
                                                                    select
                                                                    fullWidth
                                                                    label="No - Pembelian Order"
                                                                    variant="standard"
                                                                    onChange={selectPurchaseOrder}>
                                                                    {purchaseOrderList.map((option) => (
                                                                        <MenuItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
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
                                                                        {productListSelectedFromPurchase &&
                                                                            productListSelectedFromPurchase.length > 0
                                                                            ?
                                                                            <tbody>
                                                                                {productListSelectedFromPurchase.map((item, index) => {
                                                                                    return (
                                                                                        <tr key={index}>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{item?.name}</td>
                                                                                            <td>
                                                                                                <input type='tel'
                                                                                                    style={{ border: '1px solid #c0c0c0', borderRadius: 3, height: 30 }}
                                                                                                    value={item?.['quantityForStockIn']}
                                                                                                    onChange={(e) => changeQuantityFromPurchase(e.target.value, item)} />
                                                                                            </td>
                                                                                            <td>Rp {numeral(item?.['sellingPrice']).format("0,0")}</td>
                                                                                            <td>Rp {numeral(item?.['totalPriceForStockIn']).format("0,0")}</td>
                                                                                            <td onClick={() => deleteItem(index, item)} style={{ cursor: 'pointer' }}><i className="fa fa-trash"></i></td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </tbody>
                                                                            :
                                                                            <></>
                                                                        }
                                                                    </table>
                                                                    {productListSelectedFromPurchase &&
                                                                        productListSelectedFromPurchase.length > 0
                                                                        ?
                                                                        <></>
                                                                        :
                                                                        <div style={{ position: 'relative', height: 40 }}>
                                                                            <h6 style={{ position: 'relative', textAlign: 'center', top: 14 }}>Belum ada produk yang dipilih</h6>
                                                                        </div>
                                                                    }
                                                                </div>

                                                                {
                                                                    stockInData.purchaseOrderId
                                                                        ?
                                                                        <>
                                                                            <div className="btn_add_product_outline" onClick={() => addProductFormPurchase()}>
                                                                                <h6>Tambah Produk</h6>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                }
                                                            </div>
                                                        </CRow>

                                                        <div className='total-section'>
                                                            <CRow>
                                                                <CCol xs={6} style={{ textAlign: 'left' }}>
                                                                    Total Item
                                                                </CCol>
                                                                <CCol xs={6} style={{ textAlign: 'right' }}>
                                                                    {stockInData.totalItem}
                                                                </CCol>
                                                            </CRow>
                                                            <CRow>
                                                                <CCol xs={6} style={{ textAlign: 'left' }}>
                                                                    Total Quantity
                                                                </CCol>
                                                                <CCol xs={6} style={{ textAlign: 'right' }}>
                                                                    {stockInData.totalQuantity}
                                                                </CCol>
                                                            </CRow>
                                                            <CRow>
                                                                <CCol xs={6} style={{ textAlign: 'left' }}>
                                                                    Total
                                                                </CCol>
                                                                <CCol xs={6} style={{ textAlign: 'right' }}>
                                                                    Rp {numeral(stockInData.totalPrice).format("0,0")}
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
                                                        onClick={() => navigate('/stock-in')}>
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
                                                            label="Nomor"
                                                            variant="standard"
                                                            fullWidth
                                                            focused
                                                            value={stockInDetailData.stockInDetail.invoiceNumber}
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
                                                            value={moment(stockInDetailData.stockInDetail.date).format("DD/MM/YYYY")}
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
                                                            value={stockInDetailData.user.fullName ? stockInDetailData.user.fullName : stockInDetailData.user.firstName}
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
                                                            value={stockInDetailData.user.fullName ? stockInDetailData.user.fullName : stockInDetailData.user.firstName}
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
                                                                    {stockInDetailData.stockInDetail.productIn.map((item, index) => {
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
                                                            {stockInDetailData.stockInDetail.totalItem}
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total Quantity
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            {stockInDetailData.stockInDetail.totalQuantity}
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol xs={6} style={{ textAlign: 'left' }}>
                                                            Total
                                                        </CCol>
                                                        <CCol xs={6} style={{ textAlign: 'right' }}>
                                                            Rp {numeral(stockInDetailData.stockInDetail.totalPrice).format("0,0")}
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

export default StockInDetail
