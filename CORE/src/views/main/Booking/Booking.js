import React, { useState, useEffect } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
} from '@coreui/react'

import axios from '../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import background from '../../../assets/bg2.png'
import { PermissionModel } from '../../../models/Permission.model'
import { BookingList } from '../../../models/booking.class'
import { Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User } from '../../../models/user.class'
import { CompanyModel } from '../../../models/company.class';
import LayoutService from '../../../services/Layout.Service'

const columns = [
  {
    name: 'Nomor',
    selector: (row) => row.no,
    sortable: true,
  },
  {
    name: 'Perusahaan',
    selector: (row) => row.companyName,
    sortable: true,
  },
  {
    name: 'Pelanggan',
    selector: (row) => row.customerName,
    sortable: true,
  },
  // {
  //   name: 'Customer No. Telp',
  //   selector: (row) => row.customerPhone,
  // },
  {
    name: 'Status Pembayaran',
    selector: (row) => (
      <Chip
        label={row.paymentStatus.toUpperCase()}
        color={
          row.paymentStatus === 'settlement'
            ? 'success'
            : row.paymentStatus === 'none' || row.paymentStatus === 'pending'
              ? 'primary'
              : 'error'
        }
        size="small"
      />
    ),
    sortable: true,
  },
  {
    name: 'Status Pesanan',
    selector: (row) => (
      <Chip
        label={row.orderStatus.toUpperCase()}
        color={
          row.orderStatus === 'CANCEL' || row.orderStatus === 'RETURN'
            ? 'error'
            : row.orderStatus === 'NEW'
              ? 'info'
              : row.orderStatus === 'ACCEPT' ||
                row.orderStatus === 'PICK' ||
                row.orderStatus === 'START' ||
                row.orderStatus === 'FINISH' ||
                row.orderStatus === 'DELIVER'
                ? 'primary'
                : 'success'
        }
        size="small"
      />
    ),
    sortable: true,
  },
  {
    name: 'Berangkat',
    selector: (row) => row.pickupDistrict,
    sortable: true,
  },
  {
    name: 'Tiba',
    selector: (row) => row.deliveryDistrict,
    sortable: true,
  },
]

const Booking = () => {
  var componenData
  const navigate = useNavigate()
  const company = new CompanyModel(useSelector((state) => state.company))
  const token = useSelector((state) => state.token)
  const navigationList = useSelector((state) => state.navigation)
  const rolePermission = useSelector((state) => state.role.permissions)
  const rolePermissionCompany = new PermissionModel(
    rolePermission.find((perm) => perm.permissionName === 'Booking'),
  )
  var [bookingList, setCompanyList] = useState(new BookingList())
  const [visible, setVisible] = useState(false)
  let user = new User(useSelector((state) => state.user))

  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)

  const { t } = useTranslation();

  useEffect(() => {
    getAllBooking(page, perPage, '');
  }, [])

  const getAllBooking = (_page, _perPage, searchText) => {
    GetAllBooking(_page, _perPage, searchText)
      .then((response) => {
        setCompanyList(response.result)
        setTotalRows(response.totalItems)
      })
      .catch((error) => {
        // Error handling
      })
  }

  function GetAllBooking(page, size, searchText) {
    return new Promise((resolve, reject) => {
      axios({
        url: `/booking?page=${page}&size=${size}&search=${searchText}`
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  const handlePageChange = (page) => {
    var _page = Number(page) - 1
    setPage(_page)
    getAllBooking(_page, perPage, '')
  }

  const handlePerRowsChange = async (userPerPage, _page) => {
    setPerPage(userPerPage)
    getAllBooking(page, userPerPage, '')
  }

  const clickRow = (row, event) => {
    navigate(`/booking-detail/${row.id}/${row.scheduleDetailId}`)
    // if (rolePermissionCompany.permissionEdit) {
    //   setAlertVisible(false)
    //   setPageType('edit')
    //   setValue(row)
    //   setVisible(!visible)
    // } else {
    //   setAlertRoleVisible(true)
    //   setAlerRole(`Sorry... You don't have access !`)
    // }
  }

  function search(event) {
    getAllBooking(page, perPage, event.toLowerCase())
  }

  let findNavigate = navigationList.find((e) => e.name.toLowerCase() === 'booking')

  if (findNavigate && user.status === "active") {
    componenData = (
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow className="justify-content-between">
                <CCol xs="auto" className="me-auto">
                  <h5>
                    <b>Pesanan</b>
                  </h5>
                </CCol>
                {/* <CCol xs="auto">
                  <CButton color="primary" onClick={openForm}>
                    Create Company
                  </CButton>
                </CCol> */}
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CFormInput
                type="text"
                // placeholder="Search..."
                placeholder="Cari..."
                onKeyUp={(e) => search(e.target.value)}
              />
              <br></br>
              <DataTable
                columns={columns}
                data={bookingList}
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

  return componenData
}

export default Booking
