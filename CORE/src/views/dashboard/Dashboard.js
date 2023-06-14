import React from 'react'
import axios from '../../services/api'
import './Dashboard.css'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../../models/user.class'
import { CompanyModel } from '../../models/company.class'

import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { CButton } from '@coreui/react'
import moment from 'moment'
import { PermissionModel } from '../../models/Permission.model'

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  let user = new User(useSelector((state) => state.user))
  const [userData, setUserData] = useState(new User())
  let company = new CompanyModel(useSelector((state) => state.company))
  const navigate = useNavigate()
  const rolePermission = useSelector((state) => state.role.permissions)
  const rolePermissionDashboard = new PermissionModel(
    rolePermission.find((perm) => perm.permissionName === 'Dashboard'),
  )

  const [countAllBooking, setCountAllBooking] = useState(0)

  const [countBookingStatusNew, setCountBookingStatusNew] = useState(0)
  const [countBookingStatusAccept, setCountBookingStatusAccept] = useState(0)
  const [countBookingStatusPick, setCountBookingStatusPick] = useState(0)
  const [countBookingStatusStart, setCountBookingStatusStart] = useState(0)
  const [countBookingStatusFinish, setCountBookingStatusFinish] = useState(0)
  const [countBookingStatusDeliver, setCountBookingStatusDeliver] = useState(0)
  const [countBookingStatusClose, setCountBookingStatusClose] = useState(0)
  const [countBookingStatusCancel, setCountBookingStatusCancel] = useState(0)

  const [countBookingStatusItem, setCountBookingStatusItem] = useState(0)
  const [countBookingStatusItemDefect, setCountBookingStatusItemDefect] = useState(0)

  const [notificationMessage, setNotificationMessage] = useState("")

  const [greetings, setGreetings] = useState('');

  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    GetById();
    setOpen(false);
    setNotificationMessage("");
    // getNotification();
    setOpenStatus(false);
    getStatusAccount();
    setGreetings(generateGreetings())

    // if (rolePermissionDashboard.permissionView === true) {
    //   GetCountBooking();
    //   GetCountBookingStatusNew();
    //   GetCountBookingStatusAccept();
    //   GetCountBookingStatusPick();
    //   GetCountBookingStatusStart();
    //   GetCountBookingStatusFinish();
    //   GetCountBookingStatusDeliver();
    //   GetCountBookingStatusClose();
    //   GetCountBookingStatusCancel();
    //   GetCountBookingStatusItem('GOOD');
    //   GetCountBookingStatusItemDefect();
    // }
  }, [])

  const GetById = () => {
    if (user?.id) {
      axios({
        url: '/employee/get-by-id',
        headers: {
          employeeId: user.id
        }
      }).then((response) => {
        setUserData(new User(response.data.user));
      })
    }
  }

  const getNotification = () => {
    axios({
      url: `/notification/periodicalInspectionValidityLatest/${company.id}`,
      method: 'get'
    }).then((response) => {
      if (response.data) {
        setNotificationMessage(response.data.messages)
        setOpen(true)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  const getStatusAccount = () => {
    if (user.status === "suspen") {
      setOpenStatus(true)
    }
  }

  function GetCountBooking() {
    axios({
      url: '/booking/all-count',
      method: 'get',
    })
      .then((response) => {
        setCountAllBooking(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /**
   * Params -> NEW | ACCEPT | PICK | START | FINISH | DELIVER | CLOSE | CANCEL | RETURN
   * @param {*} status
   */
  function GetCountBookingStatusNew() {
    axios({
      url: `/booking/count-status/NEW`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusNew(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GetCountBookingStatusAccept() {
    axios({
      url: `/booking/count-status/ACCEPT`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusAccept(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GetCountBookingStatusPick() {
    axios({
      url: `/booking/count-status/PICK`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusPick(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GetCountBookingStatusStart() {
    axios({
      url: `/booking/count-status/START`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusStart(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GetCountBookingStatusFinish() {
    axios({
      url: `/booking/count-status/FINISH`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusFinish(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GetCountBookingStatusDeliver() {
    axios({
      url: `/booking/count-status/DELIVER`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusDeliver(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GetCountBookingStatusClose() {
    axios({
      url: `/booking/count-status/CLOSE`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusClose(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GetCountBookingStatusCancel() {
    axios({
      url: `/booking/count-status/CANCEL`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusCancel(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /**
   * Params -> GOOD | DEFECT | OTHERS
   * @param {*} statusItem
   */
  function GetCountBookingStatusItem(statusItem) {
    axios({
      url: `/booking/count-status-item/${statusItem}`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusItem(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /**
   * Params -> GOOD | DEFECT | OTHERS
   * @param {*} statusItem
   */
  function GetCountBookingStatusItemDefect() {
    axios({
      url: `/booking/count-status-item/DEFECT`,
      method: 'get',
    })
      .then((response) => {
        setCountBookingStatusItemDefect(response.data.count)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const viewProfile = () => {
    navigate(`/profile`)
  }

  const closeAlert = (event) => {
    console.log(event)
  }

  function generateGreetings() {
    var currentHour = Number(moment().format("HH"));
    if (currentHour >= 1 && currentHour < 11) {
      return t('good_morning');
    } else if (currentHour >= 11 && currentHour < 15) {
      return t('good_afternoon');
    } else if (currentHour >= 15 && currentHour < 18) {
      return t('good_afternoon');
    } else if (currentHour >= 18 || currentHour < 1) {
      return t('good_night');
    } else {
      return t('hello')
    }
  }

  return (
    <>
      {/* <WidgetsDropdown />
      <WidgetsBrand withCharts /> */}
      <div className="content unselectable">
        <Box sx={{ width: '100%' }}>
          <Collapse in={openStatus}>
            <Alert
              variant="filled" severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenStatus(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              <p>
                Karena ada aktivitas yang mencurigakan, akun anda sedang ditangguhkan untuk sementara waktu hingga kami selesai meninjau akun anda. Untuk informasi lebih lanjut silahkan hubungi pusat bantuan balen. Terima kasih.
                {/* Kami menemukan aktifitas yang mencurigakan setelah menelaah kembali aktivitas anda, sehingga akun anda di tangguhkan. Anda dapat menghubungi <a href='#' style={{color: "#FFFFFF"}}>admin</a> */}
              </p>
            </Alert>
          </Collapse>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Collapse in={open}>
            <Alert
              variant="filled" severity="warning"
              action={
                <Button color="inherit" size="small" variant="outlined"
                  onClick={() => {
                    setOpen(false);
                  }}>
                  Tandai dibaca
                </Button>
                // <IconButton
                //   aria-label="close"
                //   color="inherit"
                //   size="small"
                //   onClick={() => {
                //     setOpen(false);
                //   }}
                // >
                //   <CloseIcon fontSize="inherit" />
                // </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {notificationMessage}
            </Alert>
          </Collapse>
        </Box>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-user-box card-box bg-custom">
                <div className="row">
                  <div className="col-sm-6">
                    <span className="float-left mr-3">
                      <img src={userData.photoUrl} alt="" className="thumb-lg rounded-circle" />
                    </span>
                    <div className="media-body text-white">
                      <h4 className="mt-1 mb-1 font-18">{greetings}, {userData.fullName} !</h4>
                      <p className="font-13 text-light">{company.name}</p>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-right">
                      <button
                        type="button"
                        className="btn btn-light waves-effect"
                        onClick={viewProfile}
                      >
                        <span style={{ color: '#000000' }}>{t('edit_profile')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="row">
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-layers float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">{t('all_booking')}</h6>
                    <h2 className="" data-plugin="counterup">
                      {countAllBooking}
                    </h2>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-paypal float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">{t('new_booking')}</h6>
                    <h2 className="">{countBookingStatusNew}</h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-layers float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">Pesanan Diterima</h6>
                    <h2 className="" data-plugin="counterup">
                      {countBookingStatusAccept}
                    </h2>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-paypal float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">Pesanan Diambil</h6>
                    <h2 className="">{countBookingStatusPick}</h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-layers float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">Bersanan Dalam Perjalanan</h6>
                    <h2 className="" data-plugin="counterup">
                      {countBookingStatusStart}
                    </h2>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-rocket float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">Pesanan Selesai</h6>
                    <h2 className="" data-plugin="counterup">
                      {countBookingStatusFinish}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-layers float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">Pesanan Ditutup</h6>
                    <h2 className="" data-plugin="counterup">
                      {countBookingStatusClose}
                    </h2>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-paypal float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">Pesanan Dibatalkan</h6>
                    <h2 className="">{countBookingStatusCancel}</h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-layers float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">{t('defective_goods')}</h6>
                    <h2 className="" data-plugin="counterup">
                      {countBookingStatusItemDefect}
                    </h2>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card-box tilebox-one">
                    <i className="icon-rocket float-right text-muted"></i>
                    <h6 className="text-muted text-uppercase mt-0">{t('item_goods')}</h6>
                    <h2 className="" data-plugin="counterup">
                      {countBookingStatusItem}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
