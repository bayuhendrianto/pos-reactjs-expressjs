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
  CFormCheck,
  CAlert,
  CContainer,
} from '@coreui/react'

import axios from '../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import background from '../../../assets/bg2.png'

import { User } from '../../../models/user.class'
import { Backdrop, CircularProgress, Input, LinearProgress, Stack, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

import LayoutService from '../../../services/Layout.Service'

const PermissionList = [
  // {
  //   permissionName: 'Dashboard',
  //   permissionView: false
  // },
  {
    permissionName: 'Company',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
    permissionPartnerEdit: false,
  },
  {
    permissionName: 'Employee',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
    permissionRole: false,
    permissionStatus: false,
  },
  {
    permissionName: 'Supplier',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Customer',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Booking',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Wallet',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'BankAccount',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Income',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Withdrawal',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Role',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  // {
  //   permissionName: 'Setting',
  //   permissionView: false,
  //   permissionCreate: false,
  //   permissionEdit: false,
  //   permissionDelete: false,
  // },
  {
    permissionName: 'Category',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Unit',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Cashier',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Transaction Summary',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Stock',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Stock In',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Stock Out',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Add Stock',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
  {
    permissionName: 'Products',
    permissionView: false,
    permissionCreate: false,
    permissionEdit: false,
    permissionDelete: false,
  },
]

const Role = () => {
  var componenData;
  const userLogin = new User(useSelector((state) => state.user))
  const companyId = useSelector((state) => state.companyId)
  const rolePermission = useSelector((state) => state.role.permissions)
  const navigationList = useSelector((state) => state.navigation)

  var [roleList, setRoleList] = useState(new Array())
  const [visible, setVisible] = useState(false)

  let user = new User(useSelector((state) => state.user))

  const componenRef = useRef()
  const [roleId, setRoleId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  var [permissions, setPermissions] = useState(new Array())

  const [createdBy, setCreatedBy] = useState('')
  const [updatedBy, setUpdatedBy] = useState('')

  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const [alertRoleVisible, setAlertRoleVisible] = useState(false)
  const [alertRole, setAlerRole] = useState('')

  const [pageType, setPageType] = useState('new')
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)

  const lineHeight = Number(useSelector((state) => state.lineHeight))
  const fontSize = Number(useSelector((state) => state.fontSize))

  const [loading, setLoading] = useState(false)

  const { t } = useTranslation();

  useEffect(() => {
    getRoles(page, perPage, '');
    defaultValue();
    setPermissions(PermissionList);
    setLoading(false)
  }, [])

  const columns = [
    {
      name: t('name'),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t('description'),
      selector: (row) => row.description,
      sortable: true,
    },
  ]

  const getRoles = (_page, _perPage, searchText) => {
    GetRoles(_page, _perPage, searchText)
      .then((response) => {
        setRoleList(response.result)
      })
      .catch((error) => {
        // Error handling
      })
  }

  const handlePageChange = (page) => {
    var _page = Number(page) - 1
    setPage(_page)
    getRoles(_page, perPage, '')
  }

  const handlePerRowsChange = async (userPerPage, _page) => {
    setPerPage(userPerPage)
    getRoles(page, userPerPage, '')
  }

  function GetRoles(page, size, searchText) {
    return new Promise((resolve, reject) => {
      axios({
        url: `/roles/core?page=${page}&size=${size}&search=${searchText}`,
        method: 'get',
        headers: {
          companyId: companyId,
        },
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  function openForm() {
    let permissionRole = rolePermission.find((perm) => perm.permissionName.toLowerCase() === 'role')
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
    let permissionRole = rolePermission.find((perm) => perm.permissionName.toLowerCase() === 'role')
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

  function closeForm() {
    setVisible(false)
    for (let i = 0; i < PermissionList.length; i++) {
      // Set default value
      PermissionList[i] = {
        permissionName: PermissionList[i].permissionName,
        permissionView: false,
        permissionCreate: false,
        permissionEdit: false,
        permissionDelete: false,
      }

      if (i === PermissionList.length - 1) {
        setPermissions(PermissionList)
      }
    }
  }

  function addData() {
    var _permission = permissions.filter((perm) => perm.permissionView === true)
    var data = {
      name: name,
      description: description,
      isDefault: false,
      permissions: _permission,
      createdBy: userLogin.id
    }

    setLoading(true)

    axios({
      url: '/roles/create',
      method: 'post',
      headers: {
        companyId: companyId,
      },
      data: data,
    })
      .then(() => {
        setLoading(false)
        setVisible(false)
        getRoles(page, perPage, '')
      })
      .catch((error) => {
        setLoading(false)
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
    var _permission = permissions.filter((perm) => perm.permissionView === true)
    var data = {
      id: roleId,
      name: name,
      description: description,
      isDefault: false,
      permissions: _permission,
      updatedBy: userLogin.id
    }

    setLoading(true)

    axios({
      url: '/roles/update',
      method: 'put',
      headers: {
        companyId: companyId,
      },
      data: data,
    })
      .then(() => {
        setLoading(false)
        setVisible(false)
        getRoles(page, perPage, '')
      })
      .catch((error) => {
        setLoading(false)
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
    getRoles(page, perPage, event.toLowerCase())
  }

  function defaultValue() {
    setName('')
    setDescription('')
    setAlertVisible(false)
    setAlertMessage('')
    setAlerRole('')
    setAlertRoleVisible(false)
    setVisible(false)
  }

  function setValue(value) {
    setRoleId(value.id)
    setName(value.name)
    setDescription(value.description)
    setPermissions(new Array())

    // Looping Permisions List
    for (let i = 0; i < PermissionList.length; i++) {
      // Set default value
      PermissionList[i] = {
        permissionName: PermissionList[i].permissionName,
        permissionView: false,
        permissionCreate: false,
        permissionEdit: false,
        permissionDelete: false,
        permissionPartnerEdit: false,
        permissionRole: false,
        permissionStatus: false
      }

      // Find Permission Existing
      let findPermExist = value.permissions.find(
        (item) =>
          item.permissionName.toLowerCase() === PermissionList[i].permissionName.toLowerCase(),
      )
      if (findPermExist) {
        PermissionList[i] = findPermExist
      }

      if (i === PermissionList.length - 1) {
        // console.log(PermissionList)
        // Set Permission
        setPermissions(PermissionList)
      }
    }

    // // Set Permission
    // setPermissions(PermissionList)
  }

  function changePermission(type, perm) {
    switch (type) {
      case 'view':
        perm.permissionView = !perm.permissionView
        break
      case 'create':
        perm.permissionCreate = !perm.permissionCreate
        break
      case 'edit':
        perm.permissionEdit = !perm.permissionEdit
        break
      case 'delete':
        perm.permissionDelete = !perm.permissionDelete
        break
      case 'role':
        perm.permissionRole = !perm.permissionRole
        break
      case 'status':
        perm.permissionStatus = !perm.permissionStatus
        break
      case 'partner_on_edit':
        perm.permissionPartnerEdit = !perm.permissionPartnerEdit
        break
      default:
        break
    }
  }

  let findNavigate = navigationList.find((e) => e.name.toLowerCase() === 'role')

  if (findNavigate && user.status === "active") {
    componenData = (
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
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
                      <b>{t('role_menu')}</b>
                    </h5>
                  </CCol>
                  <CCol xs="auto">
                    <CButton
                      style={{
                        fontSize: 18,
                        background: '#00BBFF',
                        color: '#FFFFFF',
                        border: 'none'
                      }}
                      onClick={openForm}>
                      {t('add_role')}
                    </CButton>
                  </CCol>
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
                  data={roleList}
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
            backdrop="static"
            scrollable
            size="lg"
            visible={visible}
            onClose={closeForm}
            ref={componenRef}
          >
            <CAlert
              color="primary"
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
              < LinearProgress />
            </div>

            <CModalHeader>
              <CModalTitle>{pageType === 'new' ? t('add_role') : name}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm>
                <CRow>
                  <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                    <TextField
                      id="standard-basic"
                      label={t('name')}
                      variant="standard"
                      fullWidth
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      error={name.length === 0}
                    />
                  </CCol>
                </CRow> <br />
                <CRow>
                  <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                    <TextField
                      id="standard-basic"
                      label={t('description')}
                      variant="standard"
                      fullWidth
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      multiline
                      rows={4}
                      maxRows={4}
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol style={{ position: 'relative', marginTop: '20px', color: '#000' }}>
                    <b>hak akses</b>
                    <div>
                      {permissions.map((perm, index) => {
                        return (
                          <div key={index}>
                            <CCard
                              style={{
                                position: 'relative',
                                top: '10px',
                                marginBottom: '10px',
                                border: '1px solid #d8d8d8'
                              }}
                            >
                              <CCardBody>
                                <CFormCheck
                                  id="flexCheckChecked"
                                  label={perm.permissionName}
                                  defaultChecked={perm.permissionView}
                                  onChange={(e) => changePermission('view', perm)}
                                />
                                <CContainer style={{ marginLeft: '30px' }}>
                                  <CFormCheck
                                    hidden={perm.permissionName == 'Dashboard' || perm.permissionName == 'Wallet'}
                                    id="flexCheckChecked"
                                    label={perm.permissionName === 'Dashboard' || perm.permissionName == 'Wallet' ? "" : t('role_create')}
                                    defaultChecked={perm.permissionCreate}
                                    onChange={(e) => changePermission('create', perm)}
                                  />
                                  <CFormCheck
                                    hidden={perm.permissionName == 'Dashboard' || perm.permissionName == 'Wallet'}
                                    id="flexCheckChecked"
                                    label={perm.permissionName === 'Dashboard' || perm.permissionName == 'Wallet' ? "" : t('role_edit')}
                                    defaultChecked={perm.permissionEdit}
                                    onChange={(e) => changePermission('edit', perm)}
                                  />
                                  <CFormCheck
                                    hidden={perm.permissionName == 'Dashboard' || perm.permissionName == 'Wallet'}
                                    id="flexCheckChecked"
                                    label={perm.permissionName === 'Dashboard' || perm.permissionName == 'Wallet' ? "" : t('role_delete')}
                                    defaultChecked={perm.permissionDelete}
                                    onChange={(e) => changePermission('delete', perm)}
                                  />
                                  <CFormCheck
                                    hidden={perm.permissionName !== 'Employee'}
                                    id="flexCheckChecked"
                                    label={perm.permissionName === 'Employee' ? t('role_permission') : ''}
                                    defaultChecked={perm.permissionRole}
                                    onChange={(e) => changePermission('role', perm)}
                                  />
                                  <CFormCheck
                                    hidden={perm.permissionName !== 'Employee'}
                                    id="flexCheckChecked"
                                    label={perm.permissionName === 'Employee' ? t('status') : ''}
                                    defaultChecked={perm.permissionStatus}
                                    onChange={(e) => changePermission('status', perm)}
                                  />
                                  <CFormCheck
                                    hidden={perm.permissionName !== 'Company'}
                                    id="flexCheckChecked"
                                    label={perm.permissionName === 'Company' ? t('partner_on_edit') : ''}
                                    defaultChecked={perm.permissionPartnerEdit}
                                    onChange={(e) => changePermission('partner_on_edit', perm)}
                                  />

                                </CContainer>
                              </CCardBody>
                            </CCard>
                          </div>
                        )
                      })}
                    </div>
                  </CCol>
                </CRow>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton hidden={pageType === 'edit'}
                onClick={addData}
                style={{
                  background: '#00BBFF',
                  color: '#000000',
                  color: '#FFFFFF',
                  border: 'none'
                }}>
                tambah data
              </CButton>

              <CButton hidden={pageType === 'new'}
                onClick={saveData}
                style={{
                  background: '#00BBFF',
                  color: '#000000',
                  color: '#FFFFFF',
                  border: 'none'
                }}>
                simpan data
              </CButton>
              <CButton color="secondary" onClick={closeForm}
                style={{
                  background: '#FF0000',
                  color: '#FFFFFF',
                  border: 'none'
                }}>batal</CButton>
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

export default Role
