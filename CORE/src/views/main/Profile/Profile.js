import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { User } from '../../../models/user.class'
import './style.scss'

import axios from "../../../services/api"

import {
  CCol,
  CRow,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CForm,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { Input, InputAdornment, Snackbar, Stack } from '@mui/material'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'react-phone-number-input/style.css'

import { VscEye } from "react-icons/vsc";
import { RxEyeClosed } from "react-icons/rx";

const Profile = () => {
  let user = new User(useSelector((state) => state.user))
  const [userData, setUserData] = useState(new User())

  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [group, setGroup] = useState('')
  const [role, setRole] = useState('')
  const [fullName, setFullName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [gender, setGender] = useState('')
  const [religion, setReligion] = useState('')
  const [motherName, setMotherName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [subDistrict, setSubDistrict] = useState('')
  const [subDistrictId, setSubDistrictId] = useState('')
  const [district, setDistrict] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [city, setCity] = useState('')
  const [cityId, setCityId] = useState('')
  const [province, setProvince] = useState('')
  const [provinceId, setProvinceId] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const [cardNumber, setCardNumber] = useState('')

  const [firstSignInAt, setFirstSignInAt] = useState('')
  const [lastSignInAt, setLastSignInAt] = useState('')

  const [linkedIn, setLinkedIn] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')
  const [tiktok, setTiktok] = useState('')

  const [disable, setDisable] = useState(false)
  const [status, setStatus] = useState('')
  const [deviceTokenId, setDeviceTokenId] = useState('')

  var [provinceList, setProvinceList] = useState(new Array())
  var [cityList, setCityList] = useState(new Array())
  var [districtList, setDistrictList] = useState(new Array())
  var [subDistrictList, setSubDistrictList] = useState(new Array())

  const lineHeight = Number(useSelector((state) => state.lineHeight))
  const fontSize = Number(useSelector((state) => state.fontSize))

  const [alertMsg, setAlertMsg] = useState("");
  const [open, setOpen] = useState(false);

  const [openBackdrop, setOPenBackdrop] = useState(false)

  const [visible, setVisible] = useState(false)
  const [visibleSuccess, setVisibleSuccess] = useState(false)

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setOPenBackdrop(false);
    setUserData(new User());
    GetById();
    GetProvinces();

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }, [])

  const GetById = () => {
    setVisible(false)
    setVisibleSuccess(false)
    setOPenBackdrop(true)
    axios({
      url: '/employee/get-by-id',
      headers: {
        employeeId: user.id
      }
    }).then((response) => {
      setUserData(new User(response.data.user));
      setValue(new User(response.data.user))
      setTimeout(() => {
        setOPenBackdrop(false)
      }, 1000);
    })
  }

  function GetProvinces() {
    setCityList([{ label: `-- kab / kota --`, value: 0 }])
    setDistrictList([{ label: `-- kecamatan --`, value: 0 }])
    setSubDistrictList([{ label: `-- kel / desa --`, value: 0, postalCode: 0 }])
    fetchData(`https://public-location.dayanatura.com/provinces`)
      .then((response) => {
        var provinceData = []
        var _provinceData = [{ label: `-- provinsi --`, value: 0 }]
        provinceData = response.result
        provinceData.map((item) => {
          _provinceData.push({ label: item.prov_name, value: item.prov_id })
        })
        setProvinceList(_provinceData)
      }).catch((error) => {
        //
      })
  }

  function selectProvince(provinceId) {
    let findProvince = provinceList.find((item) => item.value === Number(provinceId))
    setProvince(findProvince.label)
    setProvinceId(provinceId)
    GetCities(provinceId)
    setCityList([{ label: `-- kab / kota --`, value: 0 }])
    setDistrictList([{ label: `-- kecamatan --`, value: 0 }])
    setSubDistrictList([{ label: `-- kel / desa --`, value: 0, postalCode: 0 }])

    setCityId('')
    setDistrictId('')
    setSubDistrictId('')
  }

  function GetCities(provinceId) {
    fetchData(`https://public-location.dayanatura.com/city/get-by-province/${provinceId}`)
      .then((response) => {

        var cityData = []
        var _cityData = [{ label: `-- kab / kota --`, value: 0 }]
        cityData = response.result
        cityData.map((item) => {
          _cityData.push({ label: item.city_name, value: item.city_id })
        })
        setCityList(_cityData)
      }).catch((error) => {
        //
      })
  }

  function selectCity(cityId) {
    let findCity = cityList.find((item) => item.value === Number(cityId))
    setCity(findCity.label)
    setCityId(cityId)
    GetDistricts(cityId)
    setDistrictList([{ label: `-- kecamatan --`, value: 0 }])
    setSubDistrictList([{ label: `-- kel / desa --`, value: 0, postalCode: 0 }])

    setDistrictId('')
    setSubDistrictId('')
  }

  function GetDistricts(cityId) {
    fetchData(`https://public-location.dayanatura.com/district/get-by-cityid/${cityId}`)
      .then((response) => {
        var districtData = []
        var _districtData = [{ label: `-- kecamatan --`, value: 0 }]
        districtData = response.result
        districtData.map((item) => {
          _districtData.push({ label: item.dis_name, value: item.dis_id })
        })
        setDistrictList(_districtData)
      }).catch((error) => {
        //
      })
  }

  function selectDistrict(districtId) {
    let findDistrict = districtList.find((item) => item.value === Number(districtId))
    setDistrict(findDistrict.label)
    setDistrictId(districtId)
    GetSubDistricts(districtId)
    setSubDistrictList([{ label: `-- kel / desa --`, value: 0, postalCode: 0 }])
    setSubDistrictId('')
  }

  function GetSubDistricts(districtId) {
    fetchData(`https://public-location.dayanatura.com/subdistrict/get-by-districtId/${districtId}`)
      .then((response) => {
        var subDistrictData = []
        var _subDistrictData = [{ label: `-- kel / desa --`, value: 0, postalCode: 0 }]
        subDistrictData = response.result
        subDistrictData.map((item) => {
          _subDistrictData.push({
            label: item.subdis_name,
            value: item.subdis_id,
            postalCode: item.postal_code,
          })
        })
        setSubDistrictList(_subDistrictData)
      }).catch((error) => {
        //
      })
  }

  function selectSubDistrict(subdistrictId) {
    let findSubDistrict = subDistrictList.find((item) => item.value === Number(subdistrictId))
    setSubDistrict(findSubDistrict.label)
    setSubDistrictId(subdistrictId)
    setPostalCode(findSubDistrict.postalCode)
    // GetDistricts(districtId)
  }

  async function fetchData(url, method, headers) {
    const _fetch = await fetch(url, {
      method: method,
      headers: headers
    })

    return _fetch.json()
  }

  function updateProfile() {
    var data = {
      id: userId,
      email: email,
      cardNumber: cardNumber,
      photoUrl: photoUrl,
      providerId: 'password',
      firstSignInAt: firstSignInAt,
      lastSignInAt: lastSignInAt,
      group: group,
      userType: 'core',
      role: role,
      deviceTokenId: deviceTokenId,
      fullName: fullName,
      firstName: firstName,
      lastName: lastName,
      motherName: motherName,
      birthDate: birthDate,
      birthPlace: birthPlace,
      gender: gender,
      religion: religion,
      phoneNumber: phoneNumber,
      address: address,
      subDistrict: subDistrict,
      subDistrictId: subDistrictId,
      district: district,
      districtId: districtId,
      city: city,
      cityId: cityId,
      province: province,
      provinceId: provinceId,
      postalCode: postalCode,
      lat: null,
      lng: null,

      linkedIn: linkedIn,
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
      tiktok: tiktok,
      updatedBy: userId,
      status: status
    }

    let validationCheck = {
      email: email,
      phoneNumber: phoneNumber,
      firstName: firstName,
      birthDate: birthDate,
      birthPlace: birthPlace,
      gender: gender,
      religion: religion,
      address: address,
      subDistrict: subDistrict,
      district: district,
      city: city,
      province: province,
    }

    if (hasNull(validationCheck)) {
      handleClick()
      return
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
      setAlertMsg(`Harap masukkan email valid `);
      return handleClick()
    }

    axios({
      url: '/employee/update',
      method: 'put',
      data: data
    }).then((response) => {
      setAlertMsg(`Berhasil memperbarui data`);
      handleClick();
    }).catch((error) => {
      console.log(error)
      setAlertMsg(`Gagal memperbarui data`);
      handleClick();
    })
  }

  const hasNull = (target) => {
    for (var value in target) {
      if (target[value] === '' || target[value] === null) {
        switch (value) {
          case 'email':
            setAlertMsg(`Email harus di isi`)
            break
          case 'phoneNumber':
            setAlertMsg(`No. Tlp harus di isi`)
            break
          case 'firstName':
            setAlertMsg(`Nama harus di isi`)
            break
          case 'birthDate':
            setAlertMsg(`Tanggal lahir harus di isi`)
            break
          case 'birthPlace':
            setAlertMsg(`Tempat lahir harus di isi`)
            break
          case 'gender':
            setAlertMsg(`Jenis kelamin harus di isi`)
            break
          case 'religion':
            setAlertMsg(`Agama harus di isi`)
            break
          case 'subDistrict':
            setAlertMsg(`Alamat belum lengkap`)
            break
          case 'district':
            setAlertMsg(`Alamat belum lengkap`)
            break
          case 'city':
            setAlertMsg(`Alamat belum lengkap`)
            break
          case 'province':
            setAlertMsg(`Alamat belum lengkap`)
            break
          case 'address':
            setAlertMsg(`Alamat belum lengkap`)
            break

          default:
            break
        }
        return true
      }
    }
    return false
  }

  function statusPipe(status) {
    let title = "";
    switch (status) {
      case "active":
        title = "aktif"
        break;
      case "non-active":
        title = "tidak aktif"
        break;
      case "suspen":
        title = "ditangguhkan"
        break;

      default:
        break;
    }

    return title;
  }

  function setValue(value) {
    setUserId(value.id)
    setEmail(value.email)
    setPhotoUrl(value.photoUrl)
    setGroup(value.group)
    setRole(value.role)
    setFullName(value.fullName)
    setFirstName(value.firstName)
    setLastName(value.lastName)
    setBirthDate(value.birthDate)
    setBirthPlace(value.birthPlace)
    setGender(value.gender)
    setReligion(value.religion)
    setMotherName(value.motherName)
    setPhoneNumber(value.phoneNumber)
    setAddress(value.address)
    setSubDistrict(value.subDistrict)
    setSubDistrictId(value.subDistrictId)
    setDistrict(value.district)
    setDistrictId(value.districtId)
    setCity(value.city)
    setCityId(value.cityId)
    setProvince(value.province)
    setProvinceId(value.provinceId)
    setPostalCode(value.postalCode)

    setLinkedIn(value.linkedIn)
    setFacebook(value.facebook)
    setInstagram(value.instagram)
    setTwitter(value.twitter)
    setTiktok(value.tiktok)

    setCardNumber(value.cardNumber)
    setFirstSignInAt(value.firstSignInAt)
    setLastSignInAt(value.lastSignInAt)
    setDisable(value.disable)
    setStatus(value.status)
    setDeviceTokenId(value.deviceTokenId)

    GetCities(value.provinceId)
    GetDistricts(value.cityId)
    GetSubDistricts(value.districtId)
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function changePicture(value) {
    let validateImage = validate(value[0], 1024)
    if (validateImage !== '') {
      setAlertMessage(validateImage)
      setAlertVisible(true)
      return
    }
    toBase64(value[0]).then((result) => {
      setPhotoUrl(result)

      UploadPhoto(result, userId)
        .then(() => {
          setAlertMsg('Upload photo success !')
          setTimeout(() => {
            handleClick();
            setOPenBackdrop(false)
          }, 1000);
        })
        .catch(() => {
          setAlertMsg('Upload photo fail !')
          setTimeout(() => {
            handleClick();
            setOPenBackdrop(false)
          }, 1000);
        })
    })
  }

  const toBase64 = (file) => {
    let reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        resolve(event.target.result)
      }
    })
  }

  const UploadPhoto = (base64image, userId) => {
    return new Promise((resolve, reject) => {
      axios({
        url: '/employee/upload-photo',
        method: 'post',
        data: {
          base64image: base64image,
          id: userId,
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

  const validate = (file, size) => {
    let fileSize = size ? Number(size) : 1024
    if (file === null) return 'No file selected !!'

    // Validate Size
    if (file.size > fileSize * 1024) return 'Size more than 1 Mb not allowed !!'

    return ''
  }

  const changePassword = () => {
    let data = {
      id: userId,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmPassword
    }

    if (data.newPassword.length < 8) {
      return false;
    } else if (data.newPassword.search(/[0-9]/) === -1) {
      return false;
    } else if (data.newPassword.search(/[a-z]/) === -1) {
      return false;
    } else if (data.newPassword.search(/[A-Z]/) === -1) {
      return false;
    } else if (data.newPassword.search(/[!\@\#$\%\^\&\*\(/)\_\-\+\=\<\,\>\?]/) === -1) {
      return false;
    } else if (data.confirmNewPassword !== data.newPassword) {
      return false;
    }

    setOPenBackdrop(true)

    axios({
      url: '/auth/change-password',
      method: 'post',
      data: data
    }).then(() => {
      setVisibleSuccess(!visibleSuccess);
      setOPenBackdrop(false);
    }).catch((error) => {
      setOPenBackdrop(false);
      setAlertMsg(error.response.data.message ? error.response.data.message : 'Terjadi kesalahan. Mohon ulangi beberapa saat lagi. Terima kasih.');
      handleClick()
    })

  }

  const openForm = () => {
    setVisible(!visible)
  }

  const closeAllModal = () => {
    setVisibleSuccess(!visibleSuccess);
    setVisible(!visible);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('')
    signOut();
  }

  function signOut() {
    globalThis.sessionStorage.clear()
    globalThis.location.reload()
  }

  function passwordValidation(value) {
    if (value.length < 8) {
      document.getElementById('passErrMsg').innerHTML = "Panjang kata sandi minimal 8"
      return false
    } else if (value.search(/[0-9]/) === -1) {
      document.getElementById('passErrMsg').innerHTML = "Masukkan paling tidak 1 angka"
      return false
    } else if (value.search(/[a-z]/) === -1) {
      document.getElementById('passErrMsg').innerHTML = "Masukkan paling tidak 1 huruf kecil"
      return false
    } else if (value.search(/[A-Z]/) === -1) {
      document.getElementById('passErrMsg').innerHTML = "Masukkan paling tidak 1 huruf besar"
      return false
    } else if (value.search(/[!\@\#$\%\^\&\*\(/)\_\-\+\=\<\,\>\?]/) === -1) {
      document.getElementById('passErrMsg').innerHTML = "Masukkan paling tidak 1 karakter"
      return false
    } else {
      document.getElementById('passErrMsg').innerHTML = ""
    }
  }

  function confirmPasswordValidation(value) {
    if (value !== newPassword) {
      document.getElementById('confirmPassErrMsg').innerHTML = "Konfirmasi kata sandi tidak sama"
    } else {
      document.getElementById('confirmPassErrMsg').innerHTML = ""
    }
  }

  return (
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
      <div className="container">
        <br></br>
        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile">
                    <div className="user-avatar">
                      <label>
                        <CFormInput
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          multiple
                          onChange={(e) => changePicture(e.target.files)}
                          hidden
                        />
                        <img src={photoUrl} alt={fullName} />
                      </label>
                    </div>
                    <h5 className="user-name" style={{ fontSize: fontSize }}>{fullName}</h5>
                    <h6 className="user-email" style={{ fontSize: fontSize }}>{email}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h6 className="mb-2" style={{ color: '#FFFFFF', fontSize: fontSize }}>Personal Details</h6>
                    <div style={{ width: '100%', height: 2, borderBottom: '2px solid #dedede' }}></div>
                  </div>
                  <CForm>
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <Input
                            id="input-prop"
                            type="email"
                            placeholder="email"
                            variant="standard"
                            value={email}
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                            inputProps={
                              {
                                style: {
                                  fontSize: fontSize
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
                            type="text"
                            placeholder="balen boss id"
                            variant="standard"
                            value={cardNumber}
                            fullWidth
                            inputProps={
                              {
                                readOnly: true,
                                style: {
                                  fontSize: fontSize
                                }
                              }
                            } />
                        </CCol>
                      </Stack>
                    </CRow>
                    <br></br>
                    <CRow>
                      <Stack>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="ID"
                            onChange={setPhoneNumber}
                            value={phoneNumber}
                            className={phoneNumber && isValidPhoneNumber(phoneNumber) ? 'input-active' : 'input-non-active'}
                            style={{
                              fontSize: fontSize
                            }}
                          />
                        </CCol>
                      </Stack>
                    </CRow> <br />
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <Input
                            id="input-prop"
                            type="text"
                            placeholder="nama depan"
                            variant="standard"
                            value={firstName}
                            fullWidth
                            onChange={(e) => setFirstName(e.target.value)}
                            inputProps={
                              {
                                style: {
                                  fontSize: fontSize
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
                            type="text"
                            placeholder="nama belakang"
                            variant="standard"
                            value={lastName}
                            fullWidth
                            onChange={(e) => setLastName(e.target.value)}
                            inputProps={
                              {
                                style: {
                                  fontSize: fontSize
                                }
                              }
                            } />
                        </CCol>
                      </Stack>
                    </CRow>
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              value={birthDate}
                              onChange={(newValue) => setBirthDate(dayjs(newValue))}
                              renderInput={(params) =>
                                <Input
                                  placeholder="tanggal lahir"
                                  fullWidth
                                  {...params}
                                  style={{
                                    fontSize: fontSize
                                  }}
                                />
                              }
                            />
                          </LocalizationProvider>
                        </CCol>
                      </Stack>
                    </CRow>
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <Input
                            id="input-prop"
                            type="text"
                            placeholder="tempat lahir"
                            variant="standard"
                            value={birthPlace}
                            fullWidth
                            onChange={(e) => setBirthPlace(e.target.value)}
                            inputProps={
                              {
                                style: {
                                  fontSize: fontSize
                                }
                              }
                            } />
                        </CCol>
                      </Stack>
                    </CRow>
                    <br />
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <CFormSelect
                            aria-label="addresscity"
                            id="addresscity"
                            options={[
                              'jenis kelamin',
                              { label: 'laki-laki', value: 'male' },
                              { label: 'perempuan', value: 'female' },
                            ]}
                            onChange={(e) => setGender(e.target.value)}
                            value={gender}
                            style={{
                              fontSize: fontSize,
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              borderTop: 'hidden',
                              borderLeft: 'hidden',
                              borderRight: 'hidden'
                            }}
                          />
                        </CCol>
                      </Stack>
                    </CRow> <br />
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <CFormSelect
                            aria-label="addresscity"
                            id="addresscity"
                            options={[
                              'agama',
                              { label: 'islam', value: 'islam' },
                              { label: 'kristen', value: 'kristen' },
                              { label: 'katolik', value: 'katolik' },
                              { label: 'hindu', value: 'hindu' },
                              { label: 'budha', value: 'budha' },
                            ]}
                            onChange={(e) => setReligion(e.target.value)}
                            value={religion}
                            style={{
                              fontSize: fontSize,
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              borderTop: 'hidden',
                              borderLeft: 'hidden',
                              borderRight: 'hidden'
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
                            options={provinceList}
                            onChange={(e) => selectProvince(e.target.value)}
                            value={provinceId}
                            style={{
                              fontSize: fontSize,
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              borderTop: 'hidden',
                              borderLeft: 'hidden',
                              borderRight: 'hidden'
                            }}
                          />
                        </CCol>
                      </Stack>
                    </CRow> <br />
                    <CRow>
                      <Stack lineHeight={1}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <CFormSelect
                            aria-label="addresscity"
                            id="addresscity"
                            options={cityList}
                            onChange={(e) => selectCity(e.target.value)}
                            value={cityId}
                            disabled={provinceId ? false : true}
                            style={{
                              fontSize: fontSize,
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              borderTop: 'hidden',
                              borderLeft: 'hidden',
                              borderRight: 'hidden'
                            }}
                          />
                        </CCol>
                      </Stack>
                    </CRow> <br />
                    <CRow>
                      <Stack lineHeight={1}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <CFormSelect
                            aria-label="addressdistrict"
                            id="addressdistrict"
                            options={districtList}
                            onChange={(e) => selectDistrict(e.target.value)}
                            value={districtId}
                            disabled={cityId ? false : true}
                            style={{
                              fontSize: fontSize,
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              borderTop: 'hidden',
                              borderLeft: 'hidden',
                              borderRight: 'hidden'
                            }}
                          />
                        </CCol>
                      </Stack>
                    </CRow> <br />
                    <CRow>
                      <Stack lineHeight={1}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <CFormSelect
                            aria-label="addresssubdistrict"
                            id="addresssubdistrict"
                            options={subDistrictList}
                            onChange={(e) => selectSubDistrict(e.target.value)}
                            value={subDistrictId}
                            disabled={districtId ? false : true}
                            style={{
                              fontSize: fontSize,
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              borderTop: 'hidden',
                              borderLeft: 'hidden',
                              borderRight: 'hidden'
                            }}
                          />
                        </CCol>
                      </Stack>
                    </CRow> <br />
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <Input
                            id="input-prop"
                            type="text"
                            placeholder="kodepos"
                            variant="standard"
                            value={postalCode}
                            fullWidth
                            onChange={(e) => setPostalCode(e.target.value)}
                            inputProps={
                              {
                                readOnly: true,
                                style: {
                                  fontSize: fontSize
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
                            id="input-prop"
                            type="text"
                            variant="standard"
                            placeholder="alamat lengkap"
                            value={address}
                            fullWidth
                            multiline
                            onChange={(e) => setAddress(e.target.value)}
                            rows={4}
                            inputProps={
                              {
                                style: {
                                  fontSize: fontSize
                                }
                              }
                            } />
                        </CCol>
                      </Stack>
                    </CRow>
                    <br></br>
                    <CRow>
                      <Stack lineHeight={lineHeight}>
                        <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                          <Input
                            id="input-prop"
                            type="text"
                            placeholder="kodepos"
                            variant="standard"
                            value={statusPipe(status)}
                            fullWidth
                            inputProps={
                              {
                                readOnly: true,
                                style: {
                                  fontSize: fontSize
                                }
                              }
                            }
                          />
                        </CCol>
                      </Stack>
                    </CRow>
                  </CForm>
                </div>
                <br></br>
                <CButton
                  onClick={openForm}
                  style={{
                    height: 50,
                    width: "100%",
                    fontSize: fontSize,
                    background: '#005572',
                    color: '#FFFFFF',
                    border: 'none'
                  }}>
                  ubah kata sandi
                </CButton>
                <br></br>
                <br></br>
                <CButton
                  onClick={updateProfile}
                  style={{
                    height: 50,
                    width: "100%",
                    fontSize: fontSize,
                    background: '#FEFA1D',
                    color: '#000000',
                    border: 'none'
                  }}>
                  simpan
                </CButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CModal
        alignment="center"
        size="lg"
        visible={visible}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle style={{ color: '#FFFFFF', fontSize: fontSize }}>ubah katasandi</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <Stack lineHeight={lineHeight}>
                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                  <Input
                    id="input-prop"
                    type={showOldPassword ? "email" : "password"}
                    placeholder="katasandi lama"
                    variant="standard"
                    value={oldPassword}
                    fullWidth
                    onChange={(e) => setOldPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" style={{ cursor: 'pointer' }} onClick={() => { setShowOldPassword(!showOldPassword) }}>
                        {showOldPassword ? <VscEye /> : <RxEyeClosed />}
                      </InputAdornment>
                    }
                    inputProps={
                      {
                        style: {
                          fontSize: fontSize
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
                    type={showNewPassword ? "email" : "password"}
                    placeholder="katasandi baru"
                    variant="standard"
                    value={newPassword}
                    fullWidth
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyUp={(e) => passwordValidation(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" style={{ cursor: 'pointer' }} onClick={() => { setShowNewPassword(!showNewPassword) }}>
                        {showNewPassword ? <VscEye /> : <RxEyeClosed />}
                      </InputAdornment>
                    }
                    inputProps={
                      {
                        style: {
                          fontSize: fontSize
                        }
                      }
                    } />
                  <div className="text-danger" style={{ position: 'relative', top: -30 }}><small id="passErrMsg"></small></div>
                </CCol>
              </Stack>
            </CRow>
            <CRow>
              <Stack lineHeight={lineHeight}>
                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                  <Input
                    id="input-prop"
                    type={showConfirmPassword ? "email" : "password"}
                    placeholder="konfirmasi katasandi baru"
                    variant="standard"
                    value={confirmPassword}
                    fullWidth
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyUp={(e) => confirmPasswordValidation(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" style={{ cursor: 'pointer' }} onClick={() => { setShowConfirmPassword(!showConfirmPassword) }}>
                        {showConfirmPassword ? <VscEye /> : <RxEyeClosed />}
                      </InputAdornment>
                    }
                    inputProps={
                      {
                        style: {
                          fontSize: fontSize
                        }
                      }
                    } />
                  <div className="text-danger" style={{ position: 'relative', top: -30 }}><small id="confirmPassErrMsg"></small></div>
                </CCol>
              </Stack>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            onClick={changePassword}
            style={{
              height: 50,
              width: "100%",
              fontSize: fontSize,
              background: '#FEFA1D',
              color: '#000000',
              border: 'none'
            }}>
            simpan
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
            }}>batal</CButton>
        </CModalFooter>
      </CModal>

      <CModal
        alignment="center"
        size="sm"
        visible={visibleSuccess}
      >
        <CModalBody>
          <div className="d-flex justify-content-center" style={{ marginBottom: 30 }}>
            <h3><i className="fa fa-check-circle fa-2x" style={{ color: '#00BBFF' }}></i></h3>
          </div>
          <div className="d-flex justify-content-center">
            Kata sandi berhasil di ubah
          </div>
          <div className="d-flex justify-content-center" style={{ marginBottom: 30 }}>
            Silahkan masuk ulang.
          </div>

          <div>
            <CButton
              onClick={() => closeAllModal()}
              style={{
                height: 50,
                width: "100%",
                fontSize: fontSize,
                background: '#FEFA1D',
                color: '#000000',
                border: 'none'
              }}>
              ok
            </CButton>
          </div>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Profile
