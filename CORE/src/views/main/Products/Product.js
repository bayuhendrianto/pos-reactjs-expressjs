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
import { Backdrop, CircularProgress, Input, LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ProductClass } from "../../../models/product.class"
import numeral from 'numeral'
import { NumericFormat } from 'react-number-format'

import LayoutService from '../../../services/Layout.Service'

const Product = () => {
    var componenData;
    const { t } = useTranslation();
    const userLogin = new User(useSelector((state) => state.user))
    const navigationList = useSelector((state) => state.navigation)
    const rolePermission = useSelector((state) => state.role.permissions)
    const rolePermissionProduct = new PermissionModel(
        rolePermission.find((perm) => perm.permissionName === 'Products'),
    )
    let user = new User(useSelector((state) => state.user))
    const companyId = useSelector((state) => state.companyId)
    var [productList, setProductList] = useState(new Array())
    var [categoryList, setCategoryList] = useState(new Array())
    var [unitList, setUnitList] = useState(new Array())
    const [visible, setVisible] = useState(false)

    const componentRef = useRef();
    const [productId, setProductId] = useState('')
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [description, setDescription] = useState('')
    const [thumb, setThumb] = useState('')
    const [sku, setSku] = useState('')
    const [price, setPrice] = useState('')
    const [discoundCode, setDiscoundCode] = useState('')
    const [discountPercent, setDiscountPercent] = useState('')
    const [priceAfterDiscount, setPriceAfterDiscount] = useState('')
    const [taxPercent, setTaxPercent] = useState('')

    const [tax, setTax] = useState('')
    const [priceWithTax, setPriceWithTax] = useState('')
    const [unit, setUnit] = useState('')
    const [totalPrice, setTotalPrice] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [purchasePrice, setPurchasePrice] = useState('')
    const [sellingPrice, setSellingPrince] = useState('')
    const [quantity, setQuantity] = useState('')
    const [minQuantity, setMinQuantity] = useState('')
    const [incomingQuantity, setIncomeQuantity] = useState('')
    const [quantitySold, setQuantitySold] = useState('')
    const [quantityOut, setQuantityOut] = useState('')
    const [differenceQuantity, setDifferenceQuantity] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [barcode, setBarcode] = useState('')
    const [profitInPercent, setProfitInPercent] = useState('')

    const [createdBy, setCreatedBy] = useState('')
    const [updatedBy, setUpdatedBy] = useState('')

    var [provinceList, setProvinceList] = useState(new Array())
    var [cityList, setCityList] = useState(new Array())
    var [districtList, setDistrictList] = useState(new Array())
    var [subDistrictList, setSubDistrictList] = useState(new Array())

    // Alert
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [alertRoleVisible, setAlertRoleVisible] = useState(false)
    const [alertRole, setAlerRole] = useState('')

    // Pagination Data
    const [pageType, setPageType] = useState('new')
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
        setSearchText("")
        getProducts(page, perPage, searchText);
        setCategoryList(new Array());
        setUnitList(new Array());
        defaultValue();
        setLoading(false);
        getCategory();
        getUnits();
        generateDate()
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
            name: 'harga',
            selector: (row) => `IDR ${numeral(row.sellingPrice).format("0,0")}`,
            sortable: true,
        }
    ]

    const getProducts = (_page, _perPage, searchText) => {
        axios({
            url: `/product?page=${_page}&size=${_perPage}&search=${searchText}`
        }).then((response) => {
            setProductList(response.data.result)
            setTotalRows(response.data.totalItems)
        }).catch((error) => {
            //
        })
    }

    const getCategory = () => {
        axios({
            url: '/category/all'
        }).then((response) => {
            let data = [{ label: '-- kategori --', value: '' }]
            response.data.map((item, index) => {
                data.push({ label: item.name, value: item.id })
            })
            setCategoryList(data)
        }).catch((error) => {
            //
        })
    }

    const getUnits = () => {
        axios({
            url: '/unit/all'
        }).then((response) => {
            let data = [{ label: '-- satuan --', value: '' }]
            response.data.map((item, index) => {
                data.push({ label: item.name, value: item.id })
            })
            setUnitList(data)
        }).catch((error) => {
            //
        })
    }

    function selectCategory(value) {
        let findCategory = categoryList.find((e) => e.value === value);
        setCategory(findCategory ? findCategory.value : "")
    }

    function selectUnit(value) {
        let findUnit = unitList.find((e) => e.value === value);
        setUnit(findUnit ? findUnit.value : "")
    }

    function calculatePrice(type, value) {
        switch (type) {
            case 'purchasePrice':
                setPurchasePrice(value)

                if (profitInPercent) {
                    calculateSellingPrice(value)
                    setSellingPrince("")

                    let definePercent = Number(profitInPercent) / 100;
                    let definePurchasePrice = Number(value.toString().replace(/[^\d.-]/g, ''));
                    let definePriceWithPercent = definePercent * definePurchasePrice;
                    let totalProfit = definePurchasePrice + definePriceWithPercent;

                    setSellingPrince(Math.abs(totalProfit))

                } else {
                    calculateSellingPrice(value)
                    setSellingPrince("")
                }
                break;
            case 'sellingPrice':
                calculateSellingPrice(value)
                let definePurchasePrice = Number(purchasePrice.toString().replace(/[^\d.-]/g, ''))
                let diff = Number(value.toString().replace(/[^\d.-]/g, '')) - definePurchasePrice;
                let percent = Math.abs(diff / 100);
                percent = percent < 0 ? 0 : percent;
                setProfitInPercent(percent)

                break;
            case 'profitInPercent':
                if (purchasePrice) {
                    setProfitInPercent(value)

                    let definePurchasePrice = Number(purchasePrice.toString().replace(/[^\d.-]/g, ''))
                    let definePercent = (parseInt(value) / 100) * definePurchasePrice;
                    let totalProfit = definePercent + definePurchasePrice
                    setSellingPrince(totalProfit)
                } else {
                    setProfitInPercent(value)
                    calculateSellingPrice(value)
                    setSellingPrince("")
                }
                break;

            default:
                break;
        }
    }

    function calculateSellingPrice(value) {
        setSellingPrince(value)
        setDiscountPercent("");
        setTaxPercent("");
        setPriceWithTax("");
        setPriceAfterDiscount("");
    }

    function calculateDiscount(value) {
        setDiscountPercent(value)
        setTaxPercent("");
        setPriceWithTax("");
        let _discount = (parseInt(value) / 100) * sellingPrice;
        let _priceAfterDiscount = sellingPrice - _discount
        setPriceAfterDiscount(Math.round(_priceAfterDiscount))
    }

    function calculateTax(value) {
        setTaxPercent(value)
        if (priceAfterDiscount === 0 || priceAfterDiscount === "" || priceAfterDiscount === null) {
            let countTax = (parseInt(value) / 100) * sellingPrice;
            let priceWithTax = sellingPrice + countTax;
            setPriceWithTax(priceWithTax)
        } else {
            let countTax = (parseInt(value) / 100) * priceAfterDiscount;
            let _priceWithTax = priceAfterDiscount + countTax;
            setPriceWithTax(Math.round(_priceWithTax))
        }
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

    async function openForm() {
        if (rolePermissionProduct.permissionCreate) {
            setPageType('new')
            defaultValue()
            setAlertVisible(false)
            setVisible(!visible)
        } else {
            setAlertRoleVisible(true)
            setAlerRole(`Sorry... You don't have access !`)
        }
    }

    const clickRow = async (row, event) => {
        if (rolePermissionProduct.permissionEdit) {
            try {
                const productDetail = await GetById(row.id)
                let product = new ProductClass(productDetail)
                setAlertVisible(false)
                setPageType('edit')
                setValue(product)
                setVisible(!visible)
            } catch (error) {
                setAlertVisible(false)
                setPageType('new')
                setValue(row)
                setVisible(!visible)
            }
        } else {
            setAlertRoleVisible(true)
            setAlerRole(`Sorry... You don't have access !`)
        }
    }

    function GetById(id) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/product/get-by-id/${id}`
            }).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    async function addData() {
        var data = {
            id: productId,
            name: name,
            description: description,
            thumb: thumb,
            sku: sku,
            price: Number(price.toString().replace(/[^\d.-]/g, '')),
            code: code,
            discoundCode: discoundCode,
            discountPercent: discountPercent,
            priceAfterDiscount: Number(priceAfterDiscount.toString().replace(/[^\d.-]/g, '')),
            taxPercent: taxPercent,
            tax: Number(tax.toString().replace(/[^\d.-]/g, '')),
            priceWithTax: Number(priceWithTax.toString().replace(/[^\d.-]/g, '')),
            unit: unit,
            totalPrice: Number(totalPrice.toString().replace(/[^\d.-]/g, '')),
            brand: brand,
            category: category,
            purchasePrice: Number(purchasePrice.toString().replace(/[^\d.-]/g, '')),
            sellingPrice: Number(sellingPrice.toString().replace(/[^\d.-]/g, '')),
            quantity: quantity,
            minQuantity: minQuantity,
            incomingQuantity: incomingQuantity,
            quantitySold: quantitySold,
            quantityOut: quantityOut,
            differenceQuantity: differenceQuantity,
            isActive: isActive,
            isFavorite: isFavorite,
            barcode: barcode,
            profitInPercent: profitInPercent,
            companyId: companyId,
            createdBy: userLogin.id,
        }

        let validationCheck = {
            name: name,
            code: code,
            sku: sku,
            category: category,
            unit: unit,
            purchasePrice: purchasePrice ? Number(purchasePrice.toString().replace(/[^\d.-]/g, '')) : "",
            sellingPrice: sellingPrice ? Number(sellingPrice.toString().replace(/[^\d.-]/g, '')) : "",
            minQuantity: minQuantity
        }

        if (hasNull(validationCheck)) {
            handleClick()
            return
        }

        setLoading(true)

        try {
            axios({
                url: '/product/new',
                method: 'post',
                data: data,
            })
                .then((response) => {
                    setLoading(false)
                    setPageType('new')
                    setVisible(false)
                    getProducts(page, perPage, '')
                })
                .catch((error) => {
                    setLoading(false)
                    setAlertMessage(
                        error.response.message
                            ? error.response.message
                            : error.response.data.message
                                ? error.response.data.message
                                : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
                    )
                    setAlertVisible(true)
                })
        } catch (error) {
            setLoading(false)
            setAlertMessage(
                'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
            )
            setAlertVisible(true)
        }
    }

    async function saveData() {
        var data = {
            id: productId,
            name: name,
            description: description,
            thumb: thumb,
            sku: sku,
            price: Number(price.toString().replace(/[^\d.-]/g, '')),
            code: code,
            discoundCode: discoundCode,
            discountPercent: discountPercent,
            priceAfterDiscount: Number(priceAfterDiscount.toString().replace(/[^\d.-]/g, '')),
            taxPercent: taxPercent,
            tax: Number(tax.toString().replace(/[^\d.-]/g, '')),
            priceWithTax: Number(priceWithTax.toString().replace(/[^\d.-]/g, '')),
            unit: unit,
            totalPrice: Number(totalPrice.toString().replace(/[^\d.-]/g, '')),
            brand: brand,
            category: category,
            purchasePrice: Number(purchasePrice.toString().replace(/[^\d.-]/g, '')),
            sellingPrice: Number(sellingPrice.toString().replace(/[^\d.-]/g, '')),
            quantity: quantity,
            minQuantity: minQuantity,
            incomingQuantity: incomingQuantity,
            quantitySold: quantitySold,
            quantityOut: quantityOut,
            differenceQuantity: differenceQuantity,
            isActive: isActive,
            isFavorite: isFavorite,
            barcode: barcode,
            profitInPercent: profitInPercent,
            companyId: companyId,
            updatedBy: userLogin.id,
        }

        let validationCheck = {
            name: name,
            code: code,
            sku: sku,
            category: category,
            unit: unit,
            purchasePrice: purchasePrice ? Number(purchasePrice.toString().replace(/[^\d.-]/g, '')) : "",
            sellingPrice: sellingPrice ? Number(sellingPrice.toString().replace(/[^\d.-]/g, '')) : "",
            minQuantity: minQuantity
        }

        if (hasNull(validationCheck)) {
            handleClick()
            return
        }

        setLoading(true)

        axios({
            url: '/product/update',
            method: 'put',
            data: data,
        })
            .then((response) => {
                setLoading(false)
                setPageType('new')
                setVisible(false)
                getProducts(page, perPage, '')
            })
            .catch((error) => {
                setLoading(false)
                setAlertMessage(
                    error.response.message
                        ? error.response.message
                        : error.response.data.message
                            ? error.response.data.message
                            : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
                )
                setAlertVisible(true)
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
        console.log(value)
        setSearchText(value);
        getProducts(page, perPage, value.toLowerCase())
    }

    function defaultValue() {
        setProductId('')
        setName('')
        setCode('')
        setDescription('')
        setThumb('')
        setSku('')
        setPrice('')
        setDiscoundCode('')
        setDiscountPercent('')
        setPriceAfterDiscount('')
        setTaxPercent('')

        setTax('')
        setPriceWithTax('')
        setUnit('')
        setTotalPrice('')
        setBrand('')
        setCategory('')
        setPurchasePrice('')
        setSellingPrince('')
        setQuantity('')
        setMinQuantity('')
        setIncomeQuantity('')
        setQuantitySold('')
        setQuantityOut('')
        setDifferenceQuantity('')
        setIsActive(true)
        setIsFavorite(false)
        setBarcode('')
        setProfitInPercent('')

        setCreatedBy('')
        setUpdatedBy('')

        setVisible(false)
        setAlertVisible(false)
        setAlertMessage('')
        setPageType('new')
        setAlertRoleVisible(false)
    }

    function setValue(value) {
        setProductId(value.id)
        setName(value.name)
        setCode(value.code)
        setDescription(value.description)
        setThumb(value.thumb)
        setSku(value.sku)
        setPrice(value.price)
        setDiscoundCode(value.discoundCode)
        setDiscountPercent(value.discountPercent)
        setPriceAfterDiscount(value.priceAfterDiscount)
        setTaxPercent(value.taxPercent)

        setTax(value.tax)
        setPriceWithTax(value.priceWithTax)
        setUnit(value.unit)
        setTotalPrice(value.totalPrice)
        setBrand(value.brand)
        setCategory(value.category)
        setPurchasePrice(value.purchasePrice)
        setSellingPrince(value.sellingPrice)
        setQuantity(value.quantity)
        setMinQuantity(value.minQuantity)
        setIncomeQuantity(value.incomingQuantity)
        setQuantitySold(value.quantitySold)
        setQuantityOut(value.quantityOut)
        setDifferenceQuantity(value.differenceQuantity)
        setIsActive(value.isActive)
        setIsFavorite(value.isFavorite)
        setBarcode(value.barcode)
        setProfitInPercent(value.profitInPercent)

        setCreatedBy(value.createdBy)
        setUpdatedBy(value.updatedBy)
    }

    const onButtonClick = () => {
        inputFile.current.click();
    };

    async function addDocuments(value) {
        if (value.length > 0) {
            console.log(value)
            let __formData = new FormData()
            __formData.append('file', value[0]);
            uploadDataExcel(__formData);
        } else {
            setAlertMsg(`Tidak ada file yang dipilih`);
            handleClick()
        }
    }

    function uploadDataExcel(formData) {
        axios({
            url: '/product/upload-excel',
            method: 'POST',
            data: formData
        }).then((response) => {
            setAlertMsg(`Berhasil menambah data produk`);
            handleClick()
            getProducts(page, perPage, searchText);
        }).catch((error) => {
            setAlertMsg(error?.response?.data?.message ? error?.response?.data?.message : 'Terjadi kesalahan');
            handleClick()
        })
    }

    let findNavigate = navigationList.find((e) => e.name.toLowerCase() === 'products')

    if (findNavigate && user.status === "active") {
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
                                            <b>{t('product_menu')}</b>
                                        </h5>
                                    </CCol>
                                    <CCol xs="auto">
                                        {/* <CButton
                                            style={{
                                                fontSize: 18,
                                                background: '#00BBFF',
                                                color: '#FFFFFF',
                                                border: 'none'
                                            }}
                                            onClick={openForm}>
                                            tambah produk
                                        </CButton> */}
                                        <CDropdown variant="btn-group">
                                            <CDropdownToggle
                                                style={{
                                                    fontSize: 18,
                                                    background: '#00BBFF',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    borderRadius: '4px'
                                                }} size="sm" caret={false}>
                                                tambah produk
                                            </CDropdownToggle>
                                            <CDropdownMenu style={{ cursor: 'pointer' }}>
                                                <CDropdownItem onClick={openForm}>manual</CDropdownItem>
                                                <CDropdownItem onClick={() => onButtonClick()}>
                                                    tambah dari excel
                                                </CDropdownItem>
                                                <CDropdownItem onClick={() => window.open(`${process.env.REACT_APP_API_STORAGE_SERVER}/assets/documents/contoh-produk.xlsx`)}>unduh contoh excel</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                        <input
                                            type="file"
                                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            ref={inputFile}
                                            style={{ display: 'none' }}
                                            onChange={(e) => addDocuments(e.target.files)} />
                                    </CCol>
                                </CRow>
                            </CCardHeader>
                            <CCardBody>
                                <CFormInput
                                    type="text"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChange={(e) => search(e.target.value)}
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
                        scrollable
                        size="xl"
                        visible={visible}
                    >
                        <CAlert
                            color={alertMessage.split(' ')[2] === 'success' ? 'success' : 'danger'}
                            dismissible
                            visible={alertVisible}
                            onClose={() => setAlertVisible(false)}
                        >
                            {alertMessage}
                        </CAlert>

                        <div style={{
                            height: 23,
                            width: '100%'
                        }} hidden={!loading}>
                            < LinearProgress style={{ height: 8 }} />
                        </div>

                        <CModalHeader style={{ background: '#00BBFF', color: '#FFFFFF' }} closeButton={false}>
                            <CModalTitle>{pageType === 'new' ? `${t('add')} produk` : name}</CModalTitle>
                        </CModalHeader>
                        <CModalBody style={{ background: '#00BBFF' }} ref={componentRef}>
                            {/* <CRow className="justify-content-center">
                                <div
                                    style={{
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        border: '2px solid rgba(0, 0, 0, 0.12)',
                                        width: '80px',
                                        height: '80px',
                                    }}
                                >
                                    <label>
                                        <CFormInput
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            multiple
                                            onChange={(e) => changePicture(e.target.files)}
                                            hidden
                                        />
                                        <img
                                            src={description ? description : defaultImage}
                                            alt="photo"
                                            style={{
                                                position: 'relative',
                                                right: '8px',
                                                maxWidth: 'none',
                                                width: '70px',
                                                height: '70px',
                                            }}
                                        ></img>
                                    </label>
                                </div>
                            </CRow> */}
                            <br></br>
                            <CForm>
                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="email"
                                                placeholder="nama"
                                                variant="standard"
                                                value={name}
                                                fullWidth
                                                onChange={(e) => setName(e.target.value)}
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: name ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
                                        </CCol>
                                    </Stack>
                                </CRow>
                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="kode"
                                                variant="standard"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                fullWidth
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: code ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
                                        </CCol>
                                    </Stack>
                                </CRow>
                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="barcode"
                                                variant="standard"
                                                value={barcode}
                                                fullWidth
                                                onChange={(e) => setBarcode(e.target.value)}
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: barcode ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
                                        </CCol>
                                    </Stack>
                                </CRow>

                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="sku"
                                                variant="standard"
                                                value={sku}
                                                fullWidth
                                                onChange={(e) => setSku(e.target.value)}
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: sku ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
                                        </CCol>
                                    </Stack>
                                </CRow>

                                <CRow>
                                    <Stack lineHeight={1}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <CFormSelect
                                                aria-label="addressprovince"
                                                id="addressprovince"
                                                options={unitList}
                                                onChange={(e) => selectUnit(e.target.value)}
                                                value={unit}
                                                style={{
                                                    fontSize: fontSize,
                                                    backgroundColor: '#00BBFF',
                                                    color: '#FFFFFF',
                                                    borderTop: 'hidden',
                                                    borderLeft: 'hidden',
                                                    borderRight: 'hidden',
                                                    borderBottom: unit ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                }}
                                            />
                                        </CCol>
                                    </Stack>
                                </CRow> <br />

                                <CRow>
                                    <Stack lineHeight={1}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <CFormSelect
                                                aria-label="addressprovince"
                                                id="addressprovince"
                                                options={categoryList}
                                                onChange={(e) => selectCategory(e.target.value)}
                                                value={category}
                                                style={{
                                                    fontSize: fontSize,
                                                    backgroundColor: '#00BBFF',
                                                    color: '#FFFFFF',
                                                    borderTop: 'hidden',
                                                    borderLeft: 'hidden',
                                                    borderRight: 'hidden',
                                                    borderBottom: category ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                }}
                                            />
                                        </CCol>
                                    </Stack>
                                </CRow> <br />

                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <NumericFormat
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="harga beli"
                                                variant="standard"
                                                value={purchasePrice}
                                                thousandSeparator=","
                                                prefix={'Rp '}
                                                fullWidth
                                                customInput={Input}
                                                onChange={(e) => calculatePrice('purchasePrice', e.target.value)}
                                                inputProps={{
                                                    style: {
                                                        color: '#FFFFFF',
                                                        fontSize: fontSize,
                                                        borderBottom: purchasePrice ? '3px solid #FFFFFF' : '3px solid #FEFA1D',
                                                    },
                                                }}
                                            />
                                        </CCol>
                                    </Stack>
                                </CRow>

                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="profit (%)"
                                                variant="standard"
                                                value={profitInPercent}
                                                fullWidth
                                                onChange={(e) => calculatePrice('profitInPercent', e.target.value)}
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: profitInPercent ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
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
                                                placeholder="harga jual"
                                                variant="standard"
                                                value={sellingPrice}
                                                thousandSeparator=","
                                                prefix={'Rp '}
                                                fullWidth
                                                customInput={Input}
                                                readOnly={purchasePrice ? false : true}
                                                onChange={(e) => calculatePrice('sellingPrice', e.target.value)}
                                                inputProps={{
                                                    style: {
                                                        color: '#FFFFFF',
                                                        fontSize: fontSize,
                                                        borderBottom: sellingPrice ? '3px solid #FFFFFF' : '3px solid #FEFA1D',
                                                    },
                                                }}
                                            />
                                        </CCol>
                                    </Stack>
                                </CRow>

                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="diskon (%)"
                                                variant="standard"
                                                value={discountPercent}
                                                fullWidth
                                                readOnly={sellingPrice ? false : true}
                                                onChange={(e) => calculateDiscount(e.target.value)}
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: discountPercent ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
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
                                                placeholder="harga setelah diskon"
                                                variant="standard"
                                                value={priceAfterDiscount}
                                                thousandSeparator=","
                                                prefix={'Rp '}
                                                fullWidth
                                                customInput={Input}
                                                inputProps={{
                                                    readOnly: true,
                                                    style: {
                                                        color: '#FFFFFF',
                                                        fontSize: fontSize,
                                                        borderBottom: priceAfterDiscount ? '3px solid #FFFFFF' : '3px solid #FEFA1D',
                                                    },
                                                }}
                                            />
                                        </CCol>
                                    </Stack>
                                </CRow>

                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="pajak (%)"
                                                variant="standard"
                                                value={taxPercent}
                                                fullWidth
                                                onChange={(e) => calculateTax(e.target.value)}
                                                readOnly={sellingPrice ? false : true}
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: taxPercent ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
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
                                                placeholder="harga dengan pajak"
                                                variant="standard"
                                                value={priceWithTax}
                                                thousandSeparator=","
                                                prefix={'Rp '}
                                                fullWidth
                                                customInput={Input}
                                                inputProps={{
                                                    readOnly: true,
                                                    style: {
                                                        color: '#FFFFFF',
                                                        fontSize: fontSize,
                                                        borderBottom: priceWithTax ? '3px solid #FFFFFF' : '3px solid #FEFA1D',
                                                    },
                                                }}
                                            />
                                        </CCol>
                                    </Stack>
                                </CRow>

                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                placeholder="min. quantity"
                                                variant="standard"
                                                value={minQuantity}
                                                fullWidth
                                                onChange={(e) => setMinQuantity(e.target.value)}
                                                inputProps={
                                                    {
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: minQuantity ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
                                        </CCol>
                                    </Stack>
                                </CRow>

                                <CRow>
                                    <Stack lineHeight={lineHeight}>
                                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                            <Input
                                                id="input-prop"
                                                disableUnderline
                                                type="text"
                                                variant="standard"
                                                placeholder="descripsi (optional)"
                                                value={description}
                                                fullWidth
                                                multiline
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={4}
                                                inputProps={
                                                    {
                                                        maxLength: 255,
                                                        style: {
                                                            color: "#FFFFFF",
                                                            fontSize: fontSize,
                                                            borderBottom: description ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                        }
                                                    }
                                                } />
                                        </CCol>
                                    </Stack>
                                </CRow><br />
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
                                {t('add_data')}
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
                                {t('save')}
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
                                }}>{t('cancel')}</CButton>

                        </CModalFooter>
                    </CModal>
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

export default Product
