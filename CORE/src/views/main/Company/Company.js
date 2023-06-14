import React, { useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormSelect,
  CCardFooter,
  CButton,
  CFormInput
} from '@coreui/react'
import { useEffect } from 'react'
import { useState } from 'react'

import defaultImageCompany from '../../../assets/building.png'

import './style.scss'
import { Stack } from '@mui/system'
import { Input, Snackbar } from '@mui/material'

import 'react-phone-number-input/style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from '../../../services/api'
import { User } from '../../../models/user.class'
import { PermissionModel } from '../../../models/Permission.model'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useTranslation } from 'react-i18next'
import { uploadSinglePhoto } from '../../../services/Util.Service'
import CryptoJS from 'crypto-js'
import { CompanyModel } from '../../../models/company.class'

const Company = () => {
  let { id } = useSelector((state) => state.company)
  const dispatch = useDispatch()

  const { t } = useTranslation();

  const lineHeight = Number(useSelector((state) => state.lineHeight))
  const fontSize = Number(useSelector((state) => state.fontSize))
  const userLogin = new User(useSelector((state) => state.user))
  const rolePermission = useSelector((state) => state.role.permissions)
  const rolePermissionCompany = new PermissionModel(
    rolePermission.find((perm) => perm.permissionName === 'Company'),
  )

  const componenRef = useRef()
  const [companyId, setCompanyId] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [fax, setFax] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [officeTelp, setOfficeTelp] = useState('')
  const [npwp, setNpwp] = useState('')
  const [website, setWebsite] = useState('')

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
  const [countryId, setCoutryId] = useState('')
  const [countryName, setCoutryName] = useState('')

  const [linkedIn, setLinkedIn] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')
  const [tiktok, setTiktok] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userNpwp, setUserNpwp] = useState('')
  const [userNumber, setUserNumber] = useState('')
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const [userPhoto, setUserPhoto] = useState('')

  const [scheduleMadeBefore, setScheduleMadeBefore] = useState('')
  const [status, setStatus] = useState('active')

  const [createdBy, setCreatedBy] = useState('')
  const [updatedBy, setUpdatedBy] = useState('')

  const [alertMsg, setAlertMsg] = useState('')
  const [open, setOpen] = useState(false)

  var [countryList, setCountryList] = useState(new Array())
  var [provinceList, setProvinceList] = useState(new Array())
  var [cityList, setCityList] = useState(new Array())
  var [districtList, setDistrictList] = useState(new Array())
  var [subDistrictList, setSubDistrictList] = useState(new Array())

  useEffect(() => {
    companyDetail()
    setAlertMsg("")
    setOpen(false)
    GetProvinces()
  }, [])

  const companyDetail = () => {
    axios({
      url: '/company/get-by-id',
      headers: {
        companyid: id
      }
    }).then((response) => {
      setValue(response.data)
      dispatch({ type: "set", companyDetail: response.data });
    })
  }

  function setValue(value) {
    setCompanyId(value.id)
    setName(value.name)
    setBrand(value.brand)
    setCode(value.code)
    setEmail(value.email)
    setFax(value.fax)
    setPhoneNumber(value.phoneNumber)
    setOfficeTelp(value.officeTelp)
    setNpwp(value.npwp)
    setWebsite(value.website)
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
    setCoutryId(value.countryId)
    setCoutryName(value.countryName)
    setPhotoUrl(value.photoUrl)

    setLinkedIn(value.linkedIn)
    setFacebook(value.facebook)
    setInstagram(value.instagram)
    setTwitter(value.twitter)
    setTiktok(value.tiktok)

    setCreatedBy(value.createdBy)
    setUpdatedBy(value.updatedBy)
    setScheduleMadeBefore(value.scheduleMadeBefore)
    setStatus(value.status)

    GetCities(value.provinceId)
    GetDistricts(value.cityId)
    GetSubDistricts(value.districtId)
  }

  function updateData() {
    if (rolePermissionCompany.permissionPartnerEdit) {
      let data = {
        id: companyId,
        name: name,
        brand: brand,
        code: code,
        email: email,
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
        countryId: countryId,
        countryName: countryName,
        phoneNumber: phoneNumber,
        fax: fax,
        officeTelp: officeTelp,
        npwp: npwp,
        website: website,
        photoUrl: photoUrl,
        linkedIn: linkedIn,
        facebook: facebook,
        instagram: instagram,
        twitter: twitter,
        tiktok: tiktok,
        createdBy: createdBy,
        updatedBy: userLogin.id,
        scheduleMadeBefore: scheduleMadeBefore === '-- minimum membuat jadwal (hari) --' ? '3' : scheduleMadeBefore,
        status: status
      }

      axios({
        url: `/company/update`,
        method: 'put',
        data: data,
      })
        .then((response) => {
          setAlertMsg(`Berhasil memperbarui data perusahaan`)
          setTimeout(() => {
            setOpen(true)
            companyDetail()
            updateSessionDetail(response.data.company)
          }, 1000);
        })
        .catch((error) => {
          setAlertMsg(
            error.response.data.message
              ? error.response.data.message
              : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
          )
          setTimeout(() => {
            setOpen(true)
          }, 1000);
        })
    } else {
      setAlertMsg(`Sorry... You don't have access !`)
      setTimeout(() => {
        setOpen(true)
      }, 500);
    }
  }

  function updateSessionDetail(company) {
    var data = globalThis.sessionStorage.getItem('api')
    var bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY)
    var decrypt = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

    decrypt.company = new CompanyModel(company);

    console.log(decrypt)

    const updateDataSession = CryptoJS.AES.encrypt(
      JSON.stringify(decrypt),
      process.env.REACT_APP_SECRET_KEY,
    )
    globalThis.sessionStorage.setItem('api', updateDataSession)

    dispatch({ type: "set", company: company });
  }

  function GetProvinces() {
    setCityList([{ label: `-- ${t('city')} --`, value: 0 }])
    setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
    setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])
    fetchData(`https://public-location.dayanatura.com/provinces`)
      .then((response) => {
        var provinceData = []
        var _provinceData = [{ label: `-- ${t('province')} --`, value: 0 }]
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
    setCityList([{ label: `-- ${t('city')} --`, value: 0 }])
    setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
    setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])

    setAddress('')
    setCityId('')
    setCity('')
    setDistrictId('')
    setDistrict('')
    setSubDistrictId('')
    setSubDistrict('')
    setPostalCode('')
  }

  function GetCities(provinceId) {
    fetchData(`https://public-location.dayanatura.com/city/get-by-province/${provinceId}`)
      .then((response) => {

        var cityData = []
        var _cityData = [{ label: `-- ${t('city')} --`, value: 0 }]
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
    setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
    setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])

    setAddress('')
    setDistrictId('')
    setDistrict('')
    setSubDistrictId('')
    setSubDistrict('')
    setPostalCode('')
  }

  function GetDistricts(cityId) {
    fetchData(`https://public-location.dayanatura.com/district/get-by-cityid/${cityId}`)
      .then((response) => {
        var districtData = []
        var _districtData = [{ label: `-- ${t('district')} --`, value: 0 }]
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
    setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])

    setAddress('')
    setSubDistrictId('')
    setSubDistrict('')
    setPostalCode('')
  }

  function GetSubDistricts(districtId) {
    fetchData(`https://public-location.dayanatura.com/subdistrict/get-by-districtId/${districtId}`)
      .then((response) => {
        var subDistrictData = []
        var _subDistrictData = [{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }]
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
    setPostalCode(findSubDistrict.postalCode)
    setSubDistrictId(subdistrictId)
  }

  async function fetchData(url, method, headers) {
    const _fetch = await fetch(url, {
      method: method,
      headers: headers
    })

    return _fetch.json()
  }

  async function changePicture(value) {
    setPhotoUrl('');
    toBase64(value[0]).then(async (result) => {
      setPhotoUrl(result)
      let __formData = new FormData();
      __formData.append('file', value[0])

      try {
        var _companyPhoto = await uploadSinglePhoto(__formData, "companies")
        console.log(_companyPhoto)
        axios({
          url: '/company/update-photo',
          method: 'put',
          data: {
            id: id,
            photoUrl: _companyPhoto.url
          },
        })
          .then((response) => {
            setAlertMsg(`Berhasil memperbarui data perusahaan`)
            setTimeout(() => {
              setOpen(true)
              companyDetail()
              updateSessionDetail(response.data.company)
            }, 1000);
          })
          .catch((error) => {
            console.log(error)
            setAlertMsg(
              error.response.data.message
                ? error.response.data.message
                : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
            )
            setTimeout(() => {
              setOpen(true)
            }, 1000);
          })
      } catch (error) {
        console.log(error)
        setAlertMsg(
          error.response.data.message
            ? error.response.data.message
            : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
        )
        setTimeout(() => {
          setOpen(true)
        }, 1000);
      }
    })
  }

  function toBase64(file) {
    let reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        resolve(event.target.result)
      }
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

  return (
    <div>
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
      <CCard ref={componenRef}>
        <CCardBody>
          <CRow>
            <CCol lg={3} sm={3} xs={3} xl={3} xxl={3}>
              <div
                style={{
                  overflow: 'hidden',
                  borderRadius: '8px',
                  // border: '2px solid #FEFA1D',
                  width: '80px',
                  height: '80px',
                  marginLeft: 15
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
                    src={photoUrl ? photoUrl : defaultImageCompany}
                    alt="photo"
                    style={{
                      position: 'relative',
                      right: '8px',
                      maxWidth: 'none',
                      width: '70px',
                      height: '70px',
                      marginLeft: 11,
                      borderRadius: 8
                    }}
                    id="company-photo"
                  ></img>
                </label>
              </div>
            </CCol>
            <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
              <div style={{ fontSize: 30, fontWeight: 'bold' }}>{brand}</div>
            </CCol>
          </CRow>
          <br></br>
          <CForm>
            <CRow>
              <Stack lineHeight={lineHeight}>
                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                  <Input
                    id="input-prop"
                    type="text"
                    placeholder="nama perusahaan"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
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
                    placeholder="nama merek dagang (brand)"
                    variant="standard"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    fullWidth
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
                    placeholder="nomor pokok wajip pajak (npwp)"
                    variant="standard"
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                    fullWidth
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
                    type="email"
                    placeholder="email badan usaha"
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
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
              <Stack lineHeight={4}>
                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                  <Input
                    id="input-prop"
                    type="text"
                    variant="standard"
                    placeholder="alamat situs bisnis"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    fullWidth
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

            {/** Sosial Media */}
            <CRow>
              <Stack lineHeight={lineHeight}>
                <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                  <Input
                    id="input-prop"
                    type="text"
                    variant="standard"
                    placeholder="linkedin"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    fullWidth
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
                    variant="standard"
                    placeholder="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    fullWidth
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
                    variant="standard"
                    placeholder="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    fullWidth
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
                    variant="standard"
                    placeholder="tiktok"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    fullWidth
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
                    variant="standard"
                    placeholder="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    fullWidth
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
            {/** Sosial Media */}

            <div hidden={countryId !== "ID" ? true : false}>
              <CRow>
                <Stack lineHeight={1}>
                  <CCol lg={9} sm={9} xs={9} xl={9} xxl={9}>
                    <CFormSelect
                      aria-label="addressprovince"
                      id="addressprovince"
                      options={provinceList}
                      onChange={(e) => selectProvince(e.target.value)}
                      value={provinceId}
                      disabled={countryId ? false : true}
                      style={{
                        fontSize: fontSize,
                        backgroundColor: '#00BBFF',
                        color: '#FFFFFF',
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
                        backgroundColor: '#00BBFF',
                        color: '#FFFFFF',
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
                        backgroundColor: '#00BBFF',
                        color: '#FFFFFF',
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
                        backgroundColor: '#00BBFF',
                        color: '#FFFFFF',
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
                      placeholder={t('zip_code')}
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
                      placeholder={t('legal_address')}
                      value={address}
                      fullWidth
                      multiline
                      onChange={(e) => setAddress(e.target.value)}
                      rows={4}
                      inputProps={
                        {
                          maxRows: 5,
                          style: {
                            fontSize: fontSize
                          }
                        }
                      } />
                  </CCol>
                </Stack>
              </CRow> <br />
            </div>
            <br />
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton
            style={{
              height: 50,
              width: "100%",
              fontSize: fontSize,
              background: '#FEFA1D',
              color: '#000000',
              border: 'none'
            }}
            onClick={() => updateData()}>
            simpan
          </CButton>
        </CCardFooter>
      </CCard>
    </div>

  )
}

export default Company