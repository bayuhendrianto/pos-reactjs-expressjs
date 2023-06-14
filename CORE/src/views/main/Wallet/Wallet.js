import React, { useEffect, useState, useCallback } from 'react'

import './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { User } from '../../../models/user.class'
import Snackbar from '@mui/material/Snackbar'
import { NumericFormat } from 'react-number-format'

import DataTable from 'react-data-table-component'

import {
    Box,
    Grid,
    Button,
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Collapse,
    Tooltip,
    IconButton,
    Avatar,
    Chip,
    Backdrop,
    CircularProgress,
    Tabs,
    Tab,
    Stack,
    Input
} from "@mui/material";

import background from '../../../assets/bg2.png'

import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react'
import axios from '../../../services/api'
import numeral from 'numeral'

import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import { MidtranNotificationModel } from '../../../models/midtrans.class'

import ImageViewer from 'react-simple-image-viewer'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

import CardTravelIcon from '@mui/icons-material/CardTravel';

import FsLightbox from "fslightbox-react";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { BiPlusMedical } from "react-icons/bi"

import PropTypes, { array } from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";

import { CompanyModel } from '../../../models/company.class'
import { WalletModel } from '../../../models/wallet.class'
import LayoutService from '../../../services/Layout.Service'

const columnIncomes = [
    {
        name: 'Pendapatan',
        selector: (row) => `${numeral(row.totalAmount).format("0,0")}`,
        sortable: true,
    },
    {
        name: 'Potongan admin',
        selector: (row) => `Rp ${numeral(parseInt(row.adminFee)).format("0,0")}`,
        sortable: true,
    },
    {
        name: 'Total di terima',
        selector: (row) => `Rp ${numeral(row.totalRevenueReceived).format("0,0")}`,
        sortable: true,
    },
]

const columnWithdrawal = [
    {
        name: 'Bank',
        selector: (row) => row.bank,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row) => row.status,
        sortable: true,
    },
    {
        name: 'Penarikan oleh',
        selector: (row) => row.withdrawalBy,
        sortable: true,
    },
    {
        name: 'Total penarikan',
        selector: (row) => `Rp ${numeral(row.totalWithdrawal).format("0,0")}`,
        sortable: true,
    },
]

// Initial tabs
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

const Wallet = () => {
    var walletView;
    const company = new CompanyModel(useSelector((state) => state.company));
    const user = new User(useSelector((state) => state.user));

    const theme = useTheme();
    const [value, setValue] = useState(0);

    const navigate = useNavigate()

    const [incomeList, setIncomeList] = useState(new Array());
    const [withdrawalList, setWithdrawalList] = useState(new Array());

    const [totalRowsIncome, setTotalRowsIncome] = useState(0)
    const [perPageIncome, setPerPageIncome] = useState(10)
    const [pageIncome, setPageIncome] = useState(0)

    const [totalRowsWithdrawal, setTotalRowsWithdrawal] = useState(0)
    const [perPageWithdrawal, setPerPageWithdrawal] = useState(10)
    const [pageWithdrawal, setPageWithdrawal] = useState(0)

    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    const [visibleWithdrawal, setVisibleWithdrawal] = useState(false)
    const [visibleRejectWithdrawal, setVisibleRejectWithdrawal] = useState(false)

    const [totalAllAmount, setTotalAllAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAdminFee, setTotalAdminFee] = useState(0);
    const [totalWithdrawalRequest, setTotalWithdrawalRequest] = useState(0);

    // Withdrawal Field
    const [totalWithdrawal, setTotalWithdrawal] = useState("")
    const [withdrawalId, setWithdrawalId] = useState("")
    const [bankNameWithdrawal, setBankNameWithdrawal] = useState("")
    const [accountNumberWithwaral, setAccountNumberWithdrawal] = useState("")
    const [statusWithwaral, setStatusWithwaral] = useState("")
    const [noteWithdrawaral, setNoteWithdrawaral] = useState("")
    const [withdrawalByUserId, setWithdrawalByUserId] = useState("")
    const [withdrawalBy, setWithdrawalBy] = useState("")
    const [withdrawalCreatedAt, setWithdrawalCreatedAt] = useState(new Date())
    const [withdrawalCreatedBy, setWithDrawalCreatedBy] = useState("")
    const [withdrawalUpdatedBy, setWithDrawalUpdatedBy] = useState("")

    // Company Field
    const [companyId, setCompanyId] = useState("")
    const [companyBrand, setCompanyBrand] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [companyEmail, setCompanyEmail] = useState("")
    const [companyPhoneNumber, setCompanyPhoneNumber] = useState("")
    const [companyCode, setCompanyCode] = useState("")

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [openBackdrop, setOPenBackdrop] = useState(false)

    useEffect(() => {
        setIncomeList(new Array());
        setWithdrawalList(new Array());
        getIncome(pageIncome, perPageIncome);
        getWithdrawal(pageWithdrawal, perPageWithdrawal);
        getTotalAmount();
        setOPenBackdrop(false)
    }, [])

    const getIncome = (page, perPage) => {
        axios({
            url: `/wallet/income-core?page=${page}&size=${perPage}`,
            method: "get",
            headers: {
                companyId: company.id
            }
        }).then((response) => {
            setIncomeList(response.data.result)
            setTotalRowsIncome(response.data.totalItems)
        }).catch((error) => {
            console.log(error)
        })
    }

    const getWithdrawal = (page, perPage) => {
        axios({
            url: `/wallet/withdrawal-core?page=${page}&size=${perPage}`,
            method: "get"
        }).then((response) => {
            setWithdrawalList(response.data.result)
            setTotalRowsWithdrawal(response.data.totalItems)
        }).catch((error) => {
            console.log(error)
        })
    }

    const getTotalAmount = async () => {
        axios({ url: "/wallet/totalAmount", method: "get" })
            .then((response) => {
                setTotalAllAmount(response.data.totalAllAmount);
                setTotalAmount(response.data.totalAmount);
                setTotalAdminFee(response.data.totalAdminFee);
                setTotalWithdrawalRequest(response.data.withdrawal);
            }).catch((error) => {
                console.log(error)
            })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handlePageChangeIncome = (page) => {
        var _page = Number(page) - 1
        setPageIncome(_page)
        getIncome(_page, perPage, '')
    }

    const handlePerRowsChangeIncome = async (usePerPage, _page) => {
        setPerPageIncome(usePerPage)
        getIncome(page, usePerPage, '')
    }

    const clickRowIncome = (row, event) => {
        axios({
            url: `booking/get-by-id/${row.bookingId}`,
            method: 'get'
        }).then((response) => {
            navigate(`/booking-detail/${row.bookingId}/${response.data.scheduleDetailId}`)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handlePageChangeWithdrawal = (page) => {
        var _page = Number(page) - 1
        setPageWithdrawal(_page)
        getWithdrawal(_page, perPage, '')
    }

    const handlePerRowsChangeWithdrawal = async (usePerPage, _page) => {
        setPerPageWithdrawal(usePerPage)
        getWithdrawal(page, usePerPage, '')
    }

    const clickRowWithdrawal = (row, event) => {
        setOPenBackdrop(true);

        axios({
            url: `/wallet/withdrawal/${row.id}/${row.companyId}`,
            method: "get"
        }).then((response) => {
            setOPenBackdrop(false);
            setValueWithdrawal(response.data.withdrawal);
            setValueCompany(response.data.company);

            setVisibleWithdrawal(true)
        }).catch((error) => {
            console.log(error)
            setOPenBackdrop(false);
        })
    }

    const getWithdrawalDetail = (row) => {

    }

    function requestWithdrawal() {

    }

    function setValueWithdrawal(value) {
        setWithdrawalId(value.id)
        setTotalWithdrawal(value.totalWithdrawal)
        setBankNameWithdrawal(value.bank)
        setAccountNumberWithdrawal(value.accountNumber)
        setStatusWithwaral(value.status)
        setNoteWithdrawaral(value.notes)
        setWithdrawalByUserId(value.withdrawalByUserId)
        setWithdrawalBy(value.withdrawalBy)
        setWithdrawalCreatedAt(new Date(value.withdrawalCreatedAt));
        setWithDrawalCreatedBy(value.createdBy)
        setWithDrawalUpdatedBy(value.updatedBy)
    }

    function setValueCompany(value) {
        setCompanyId(value.id)
        setCompanyBrand(value.brand)
        setCompanyName(value.name)
        setCompanyEmail(value.email)
        setCompanyPhoneNumber(value.phoneNumber)
        setCompanyCode(value.code)
    }

    function transferSuccess() {
        let data = {
            id: withdrawalId,
            companyId: companyId,
            bank: bankNameWithdrawal,
            accountNumber: accountNumberWithwaral,
            totalWithdrawal: Number(totalWithdrawal.toString().replace(/[^\d.-]/g, '')),
            status: "success",
            notes: noteWithdrawaral,
            withdrawalByUserId: withdrawalByUserId,
            withdrawalBy: withdrawalBy,
            withdrawalCreatedAt: new Date(withdrawalCreatedAt),
            createdBy: withdrawalCreatedBy,
            updatedBy: user.id
        }

        setOPenBackdrop(true);

        axios({
            url: "/wallet/update-withdrawal",
            method: "put",
            data: data
        }).then(() => {
            setValue(0)
            setTimeout(() => {
                setValue(1)
            }, 0);

            setOPenBackdrop(false);
            setAlertMsg("Berhasil memperbarui penarikan");
            handleClick();

            setVisibleWithdrawal(false);
            setVisibleRejectWithdrawal(false);
            getWithdrawal(pageWithdrawal, perPageWithdrawal)
        }).catch(() => {
            setOPenBackdrop(false);
            setAlertMsg("Gagal memperbarui penarikan");
            handleClick();
        })
    }

    function rejectWithdrawal() {
        setVisibleWithdrawal(false)
        setVisibleRejectWithdrawal(true)
    }

    function confirmReject() {
        let data = {
            id: withdrawalId,
            companyId: companyId,
            bank: bankNameWithdrawal,
            accountNumber: accountNumberWithwaral,
            totalWithdrawal: Number(totalWithdrawal.toString().replace(/[^\d.-]/g, '')),
            status: "reject",
            notes: noteWithdrawaral,
            withdrawalByUserId: withdrawalByUserId,
            withdrawalBy: withdrawalBy,
            withdrawalCreatedAt: new Date(withdrawalCreatedAt),
            createdBy: withdrawalCreatedBy,
            updatedBy: user.id
        }

        if (data.notes === null || data.notes === "") {
            setAlertMsg("Harap masukkan alasan mengapa penarikan di tolak");
            handleClick();
            return;
        }

        setOPenBackdrop(true);

        axios({
            url: "/wallet/update-withdrawal",
            method: "put",
            data: data
        }).then((response) => {
            setValue(0)
            setTimeout(() => {
                setValue(1)
            }, 0);

            setOPenBackdrop(false);
            setAlertMsg("Berhasil memperbarui penarikan");
            handleClick();

            setVisibleWithdrawal(false);
            setVisibleRejectWithdrawal(false);
            getWithdrawal(pageWithdrawal, perPageWithdrawal);
            getTotalAmount();
        }).catch(() => {
            setOPenBackdrop(false);
            setAlertMsg("Gagal memperbarui penarikan");
            handleClick();
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

    walletView = (
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
            <div className="content">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="profile-user-box card-box bg-custom">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="media-body text-white">
                                            <h4 className="mt-1 mb-1 font-18">Total Fee</h4>
                                            <p className="font-13 text-light"></p>
                                            <h2 className="text-light mb-0">Rp {numeral(totalAdminFee).format("0,0")}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="row">
                                <div className="col-sm-4 col-lg-4">
                                    <div className="card-box tilebox-one" style={{ backgroundColor: "#FC40B8" }}>
                                        <i className="icon-layers float-right text-muted"></i>
                                        <h6 className="text-white mt-0">Total Semua Pendapatan</h6>
                                        <h3 className="text-white" data-plugin="counterup">Rp {numeral(totalAllAmount).format("0,0")}</h3>
                                    </div>
                                </div>
                                <div className="col-sm-4 col-lg-4">
                                    <div className="card-box tilebox-one" style={{ backgroundColor: "#FFD500" }}>
                                        <i className="icon-layers float-right text-muted"></i>
                                        <h6 className="text-white mt-0">Total Pendapatan Aktif</h6>
                                        <h3 className="text-white" data-plugin="counterup">Rp {numeral(totalAmount).format("0,0")}</h3>
                                    </div>
                                </div>
                                <div className="col-sm-4 col-lg-4">
                                    <div className="card-box tilebox-one" style={{ backgroundColor: "#00AAE3" }}>
                                        <i className="icon-layers float-right text-muted"></i>
                                        <h6 className="text-white mt-0">Total Penarikan</h6>
                                        <h3 className="text-white" data-plugin="counterup">Rp {numeral(totalWithdrawalRequest).format("0,0")}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-12" >
                            <Box sx={{ bgcolor: "background.paper" }}>
                                <AppBar position="static">
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        style={{ backgroundColor: "#00BBFF" }}
                                        textColor="inherit"
                                        variant="fullWidth"
                                        aria-label="full width tabs example"
                                    >
                                        <Tab label="Saldo Masuk" {...a11yProps(0)} style={{ textTransform: 'none', color: '#000000' }} onClick={() => getIncome(pageIncome, perPageIncome)} />
                                        <Tab label="Penarikan" {...a11yProps(1)} style={{ textTransform: 'none', color: '#000000' }} onClick={() => getWithdrawal(pageWithdrawal, perPageWithdrawal)} />
                                    </Tabs>
                                </AppBar>
                                <SwipeableViews
                                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                                    index={value}
                                    onChangeIndex={handleChangeIndex}
                                >
                                    <TabPanel value={value} index={0} dir={theme.direction}>
                                        <CRow>
                                            <CCol xs>
                                                <CCard className="mb-4">
                                                    <CCardHeader>
                                                        <CRow className="justify-content-between">
                                                            <CCol xs="auto" className="me-auto">
                                                                <h5>
                                                                    <b>Saldo Masuk</b>
                                                                </h5>
                                                            </CCol>
                                                        </CRow>
                                                    </CCardHeader>
                                                    <CCardBody>
                                                        <DataTable
                                                            columns={columnIncomes}
                                                            data={incomeList}
                                                            pagination
                                                            paginationServer
                                                            paginationTotalRows={totalRowsIncome}
                                                            onChangePage={handlePageChangeIncome}
                                                            onChangeRowsPerPage={handlePerRowsChangeIncome}
                                                            onRowClicked={clickRowIncome}
                                                            highlightOnHover
                                                            noDataComponent={<>tidak ada data</>}
                                                            paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                                            customStyles={LayoutService().customStylesDataTable()}
                                                        />
                                                    </CCardBody>
                                                </CCard>
                                            </CCol>
                                        </CRow>
                                    </TabPanel>
                                    <TabPanel value={value} index={1} dir={theme.direction}>
                                        <CRow>
                                            <CCol xs>
                                                <CCard className="mb-4">
                                                    <CCardHeader>
                                                        <CRow className="justify-content-between">
                                                            <CCol xs="auto" className="me-auto">
                                                                <h5>
                                                                    <b>Penarikan</b>
                                                                </h5>
                                                            </CCol>
                                                        </CRow>
                                                    </CCardHeader>
                                                    <CCardBody>
                                                        <DataTable
                                                            columns={columnWithdrawal}
                                                            data={withdrawalList}
                                                            pagination
                                                            paginationServer
                                                            paginationTotalRows={totalRowsWithdrawal}
                                                            onChangePage={handlePageChangeWithdrawal}
                                                            onChangeRowsPerPage={handlePerRowsChangeWithdrawal}
                                                            onRowClicked={clickRowWithdrawal}
                                                            highlightOnHover
                                                            noDataComponent={<>tidak ada data</>}
                                                            paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                                            customStyles={LayoutService().customStylesDataTable()}
                                                        />
                                                    </CCardBody>
                                                </CCard>
                                            </CCol>
                                        </CRow>
                                    </TabPanel>
                                </SwipeableViews>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>

            <CRow>
                <CModal
                    alignment="center"
                    backdrop="static"
                    size="lg"
                    visible={visibleWithdrawal}
                    onClose={() => setVisibleWithdrawal(false)}
                    scrollable
                >

                    <CModalHeader style={{ background: '#00BBFF', color: '#FFFFFF' }}>
                        <CModalTitle>Detail Penarikan</CModalTitle>
                    </CModalHeader>
                    <CModalBody style={{ background: '#00BBFF' }}>
                        <CForm>
                            <CRow>
                                <Stack lineHeight={lineHeight}>
                                    <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="perusahaan"
                                            readOnly
                                            disableUnderline
                                            fullWidth
                                            variant="standard"
                                            value={companyName}
                                            inputProps={
                                                {
                                                    readOnly: true,
                                                    style: {
                                                        color: "#FFFFFF",
                                                        fontSize: fontSize,
                                                        borderBottom: '3px solid #FFFFFF'
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
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="kode"
                                            readOnly
                                            disableUnderline
                                            fullWidth
                                            variant="standard"
                                            value={companyCode}
                                            inputProps={
                                                {
                                                    readOnly: true,
                                                    style: {
                                                        color: "#FFFFFF",
                                                        fontSize: fontSize,
                                                        borderBottom: '3px solid #FFFFFF'
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
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="email"
                                            readOnly
                                            disableUnderline
                                            fullWidth
                                            variant="standard"
                                            value={companyEmail}
                                            inputProps={
                                                {
                                                    readOnly: true,
                                                    style: {
                                                        color: "#FFFFFF",
                                                        fontSize: fontSize,
                                                        borderBottom: '3px solid #FFFFFF'
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
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="nomor telepon"
                                            readOnly
                                            disableUnderline
                                            fullWidth
                                            variant="standard"
                                            value={companyPhoneNumber}
                                            inputProps={
                                                {
                                                    readOnly: true,
                                                    style: {
                                                        color: "#FFFFFF",
                                                        fontSize: fontSize,
                                                        borderBottom: '3px solid #FFFFFF'
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
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="penarikan oleh"
                                            readOnly
                                            disableUnderline
                                            fullWidth
                                            variant="standard"
                                            value={withdrawalBy}
                                            inputProps={
                                                {
                                                    readOnly: true,
                                                    style: {
                                                        color: "#FFFFFF",
                                                        fontSize: fontSize,
                                                        borderBottom: '3px solid #FFFFFF'
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
                                            fullWidth
                                            customInput={Input}
                                            value={totalWithdrawal}
                                            prefix={'Rp '}
                                            thousandSeparator=","
                                            placeholder="jumlah yang ditarik"
                                            required
                                            disableUnderline
                                            inputProps={
                                                {
                                                    readOnly: true,
                                                    style: {
                                                        color: "#FFFFFF",
                                                        fontSize: fontSize,
                                                        borderBottom: '3px solid #FFFFFF'
                                                    }
                                                }
                                            }
                                        />
                                    </CCol>
                                </Stack>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter style={{ background: '#00BBFF' }}>
                        <CButton color="primary"
                            style={{
                                height: 45,
                                width: "100%",
                                fontSize: fontSize,
                                background: '#FEFA1D',
                                color: '#000000',
                                border: 'none'
                            }}
                            onClick={() => transferSuccess()}>
                            transfer selesai
                        </CButton>
                        <CButton color="secondary"
                            style={{
                                height: 45,
                                width: "100%",
                                fontSize: fontSize,
                                background: '#FF0000',
                                color: '#FFFFFF',
                                border: 'none',
                                marginTop: 10,
                                marginBottom: 10
                            }}
                            onClick={() => rejectWithdrawal()}>
                            tolak permintaan
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CRow>

            <CRow>
                <CModal
                    alignment="center"
                    backdrop="static"
                    size="lg"
                    visible={visibleRejectWithdrawal}
                    onClose={() => setVisibleRejectWithdrawal(false)}
                    scrollable
                >

                    <CModalHeader style={{ background: '#00BBFF', color: '#FFFFFF' }}>
                        <CModalTitle>Total Penarikan ?</CModalTitle>
                    </CModalHeader>
                    <CModalBody style={{ background: '#00BBFF' }}>
                        <CForm>
                            <CRow>
                                <Stack lineHeight={lineHeight}>
                                    <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                                        <Input
                                            id="input-prop"
                                            disableUnderline
                                            type="text"
                                            variant="standard"
                                            placeholder="masukkan alasan mengapa penarikan di tolak"
                                            value={noteWithdrawaral}
                                            fullWidth
                                            multiline
                                            onChange={(e) => setNoteWithdrawaral(e.target.value)}
                                            rows={4}
                                            inputProps={
                                                {
                                                    maxRows: 5,
                                                    style: {
                                                        color: "#FFFFFF",
                                                        fontSize: fontSize,
                                                        borderBottom: noteWithdrawaral ? '3px solid #FFFFFF' : '3px solid #FEFA1D'
                                                    }
                                                }
                                            } />
                                    </CCol>
                                </Stack>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter style={{ background: '#00BBFF' }}>
                        <CButton color="primary"
                            style={{
                                height: 45,
                                width: "100%",
                                fontSize: fontSize,
                                background: '#FEFA1D',
                                color: '#000000',
                                border: 'none'
                            }}
                            onClick={() => confirmReject()}>
                            konfirmasi
                        </CButton>
                        <CButton color="secondary"
                            style={{
                                height: 45,
                                width: "100%",
                                fontSize: fontSize,
                                background: '#FF0000',
                                color: '#FFFFFF',
                                border: 'none',
                                marginTop: 10,
                                marginBottom: 10
                            }}
                            onClick={() => setVisibleRejectWithdrawal(false)}>
                            batal
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CRow>
        </>
    )

    return (
        walletView
    )
}

export default Wallet