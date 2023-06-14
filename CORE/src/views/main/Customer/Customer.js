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
    CAlert,
    CFormSelect,
    CTable,
    CTableHead,
    CTableBody,
    CTableDataCell,
    CTableRow,
    CTableHeaderCell,
} from '@coreui/react'

import axios from '../../../services/api'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import defaultImage from '../../../assets/boss.png'
import moment from 'moment'
import { toBase64, validate, uploadMultipleDocument, randomNumbersLetters } from '../../../services/Util.Service'
import background from '../../../assets/bg2.png'
import Snackbar from '@mui/material/Snackbar'

import './style.scss'

import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { PermissionModel } from '../../../models/Permission.model'
import { User } from '../../../models/user.class'
import { Backdrop, CircularProgress, Input, LinearProgress, MenuItem, Stack, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { GetCityByProvinceId, GetDistrictByCityId, GetProvinces, GetSubDistrictByDistrictId } from '../../../services/Location.Service'

import LayoutService from '../../../services/Layout.Service'

const Customer = () => {
    var componenData;
    const { t } = useTranslation();
    const userLogin = new User(useSelector((state) => state.user))
    const navigationList = useSelector((state) => state.navigation)
    const rolePermission = useSelector((state) => state.role.permissions)
    const rolePermissionCustomer = new PermissionModel(
        rolePermission.find((perm) => perm.permissionName === 'Customer'),
    )

    const rolePermissionEmployee = new PermissionModel(
        rolePermission.find((perm) => perm.permissionName === 'Employee'),
    )
    const companyId = useSelector((state) => state.companyId)
    var [customerList, setCustomerList] = useState(new Array())
    const [visible, setVisible] = useState(false)

    let user = new User(useSelector((state) => state.user))

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
    const [companyName, setCompanyName] = useState('')

    const [firstSignInAt, setFirstSignInAt] = useState('')
    const [lastSignInAt, setLastSignInAt] = useState('')

    const [disable, setDisable] = useState(false)
    const [status, setStatus] = useState('')
    const [deviceTokenId, setDeviceTokenId] = useState('')

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

    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    // Document
    var [documents, setDocuments] = useState(new Array())
    var [documentList, setDocumentList] = useState(new Array())

    const [alertMsg, setAlertMsg] = useState('')
    const [open, setOpen] = useState(false)

    const inputFile = useRef(null)

    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        getCustomers(page, perPage, '');
        defaultValue();
        getProvinces();
    }, [])

    const columns = [
        {
            name: t('photo'),
            selector: (row) => <img src={row.photoUrl ? row.photoUrl : defaultImageCompany} width={40} alt="photo"></img>,
            width: '100px',
        },
        {
            name: t('name'),
            selector: (row) => row.fullName,
            sortable: true,
        },
        {
            name: t('status'),
            selector: (row) => row.status,
            cell: (row) => statusPipe(row.status),
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

    const genderList = [
        { label: t('gender'), value: '' },
        { label: t('male'), value: 'male' },
        { label: t('female'), value: 'female' }
    ];

    const religionList = [
        { label: t('religion'), value: '' },
        { label: t('islam'), value: 'islam' },
        { label: t('christianity'), value: 'christianity' },
        { label: t('catholicism'), value: 'catholicism' },
        { label: t('hinduism'), value: 'hinduism' },
        { label: t('buddhism'), value: 'buddhism' },
    ];

    const statusList = [
        { label: t('active'), value: 'active' },
        { label: t('non_active'), value: 'non-active' },
        { label: t('suspended'), value: 'suspen' },
    ];

    const statusPipe = (companyStatus) => {
        let status = "";
        switch (companyStatus) {
            case 'active':
                status = t('active');
                break;
            case 'non-active':
                status = t('non_active');
                break;
            case 'suspen':
                status = t('suspended')
                break;

            default:
                break;
        }

        return status;
    }

    const getCustomers = (_page, _perPage, searchText) => {
        axios({
            url: `/customer?page=${_page}&size=${_perPage}&search=${searchText}`,
            method: 'get',
            data: {},
        })
            .then((response) => {
                setCustomerList(response.data.result)
                setTotalRows(response.data.totalItems)
            })
            .catch((error) => {
                reject(error)
            })
    }

    const handlePageChange = (page) => {
        var _page = Number(page) - 1
        setPage(_page)
        getCustomers(_page, perPage, '')
    }

    const handlePerRowsChange = async (userPerPage, _page) => {
        setPerPage(userPerPage)
        getCustomers(page, userPerPage, '')
    }

    async function openForm() {
        if (rolePermissionCustomer.permissionCreate) {
            setPageType('new')
            defaultValue()
            setCardNumber(`${randomNumbersLetters(7)}${new Date().getTime().toString().slice(5)}`)
            setAlertVisible(false)
            setVisible(!visible)
            setLoading(false)
        } else {
            setLoading(false)
            setAlertRoleVisible(true)
            setAlerRole(`Sorry... You don't have access !`)
        }
    }

    const clickRow = async (row, event) => {
        if (rolePermissionCustomer.permissionEdit) {
            try {
                const customerDetail = await GetById(row.id)
                let user = new User(customerDetail)
                setAlertVisible(false)
                setPageType('edit')
                user.birthDate = user.birthDate
                    ? moment(new Date(user.birthDate)).format('YYYY-MM-DD')
                    : user.birthDate
                setValue(user)
                setVisible(!visible)
            } catch (error) {
                setAlertVisible(false)
                setPageType('edit')
                row.birthDate = row.birthDate
                    ? moment(new Date(row.birthDate)).format('YYYY-MM-DD')
                    : row.birthDate
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
                url: `/customer/get-by-id`,
                method: 'get',
                headers: { customerId: id },
            })
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    async function addData() {
        var documentsData = []
        var data = {
            id: userId,
            email: email,
            cardNumber: cardNumber,
            photoUrl: photoUrl,
            providerId: 'password',
            firstSignInAt: null,
            lastSignInAt: null,
            group: group,
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
            companyId: null,
            companyName: companyName,
            createdBy: userLogin.id,
            status: status,
            documents: [],
        }

        if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
            setAlertMsg("No.tlp tidak valid")
            handleClick()
            return
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

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
            setAlertMsg(`Harap masukkan email pemasok yang valid `);
            return handleClick()
        }

        if (hasNull(validationCheck)) {
            handleClick()
            return
        }

        // if (documents.length === 0) {
        //     setAlertMsg(`Belum ada dokumen yang di unggah`);
        //     return handleClick()
        // }

        setLoading(true)

        try {
            if (documents.length > 0) {
                let __formData = new FormData()
                for (let i = 0; i < documents.length; i++) {
                    __formData.append('files', documents[i])

                    if (i === documents.length - 1) {
                        const fetchData = await uploadMultipleDocument(__formData, 'documents')

                        fetchData.response.map((res) => {
                            documentsData.push({
                                name: res.fileName,
                                companyId: companyId,
                                url: res.url,
                                status: 'new',
                                path: 'documents',
                                id: "",
                                userId: "",
                                customerId: ""
                            })
                        })

                        data.documents = documentsData

                        axios({
                            url: '/customer/new',
                            method: 'post',
                            data: data,
                        })
                            .then((response) => {
                                setLoading(false)
                                setPageType('new')
                                setVisible(false)
                                getCustomers(page, perPage, '')
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
                }
            } else {
                axios({
                    url: '/customer/new',
                    method: 'post',
                    data: data,
                })
                    .then((response) => {
                        setLoading(false)
                        setPageType('new')
                        setVisible(false)
                        getCustomers(page, perPage, '')
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
            id: userId,
            email: email,
            cardNumber: cardNumber,
            photoUrl: photoUrl,
            providerId: 'password',
            firstSignInAt: firstSignInAt,
            lastSignInAt: lastSignInAt,
            group: group,
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
            companyId: null,
            companyName: companyName,
            updatedBy: userLogin.id,
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

        if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
            setAlertMsg("No.tlp tidak valid")
            handleClick()
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
            setAlertMsg(`Harap masukkan email pemasok yang valid `);
            return handleClick()
        }

        if (hasNull(validationCheck)) {
            handleClick()
            return
        }

        setLoading(true)

        axios({
            url: '/customer/update',
            method: 'put',
            data: data,
        })
            .then((response) => {
                setLoading(false)
                setPageType('new')
                setVisible(false)
                getCustomers(page, perPage, '')
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

    function resetPassword() {
        setLoading(true)
        axios({
            url: `/auth/reset-password/${userId}`,
            method: 'post'
        })
            .then((response) => {
                setLoading(false)
                setAlertMsg(`Berhasil mereset kata sandi. Informasi katasandi baru kami kirimkan ke email ${email}`)
                handleClick()
            })
            .catch((error) => {
                setLoading(false)
                setAlertMsg(
                    error.response.message
                        ? error.response.message
                        : error.response.data.message
                            ? error.response.data.message
                            : 'Oops. Maaf ada kesalahan. Silahakan ulangi kembali atau hubungi admin. Terima kasih !',
                )
                handleClick()
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

    function changePicture(value) {
        setPhotoUrl('')
        let validateImage = validate(value[0], 1024)
        if (validateImage !== '') {
            setAlertMessage(validateImage)
            setAlertVisible(true)
            return
        }
        toBase64(value[0]).then((result) => {
            setPhotoUrl(result)

            if (pageType === 'edit') {
                axios({
                    url: '/customer/upload-photo',
                    method: 'post',
                    data: {
                        base64image: result,
                        id: userId,
                    },
                })
                    .then((res) => {
                        getCustomers(page, perPage, '')
                        setPageType('new')
                        setAlertMessage('Upload photo success !')
                        setAlertVisible(true)
                        setTimeout(() => {
                            setVisible(!visible)
                        }, 2000)
                    })
                    .catch(() => {
                        setAlertMessage('Upload photo fail !')
                        setAlertVisible(true)
                    })
            }
        })
    }

    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    async function addDocuments(value) {
        let dataFile = []
        for (let i = 0; i < value.length; i++) {
            var name = new Array(value[i])
            dataFile.push(name[0])
            if (i === value.length - 1) {
                setDocuments(dataFile)
            }
        }
    }

    function removeDocument(index) {
        // Issue
        // Untuk menghapus array seharusnya cukup dengan fungsi splice(index, count)
        // Tetapi pada kasus ini, data yang ada di dalam variable documents harus di looping ulang
        let dataFile = []
        documents.splice(index, 1)
        if (documents.length === 0) {
            setDocuments([])
        } else {
            for (let i = 0; i < documents.length; i++) {
                var doc = new Array(documents[i])
                dataFile.push(doc[0])
                if (i === documents.length - 1) {
                    setDocuments(dataFile)
                }
            }
        }
    }

    function openDocument(value) {
        window.open(value.url, '_blank')
    }

    function search(event) {
        getCustomers(page, perPage, event.toLowerCase())
    }

    function getProvinces() {
        GetProvinces().then((response) => {
            var provinceData = []
            var _provinceData = [{ label: `-- ${t('province')} --`, value: 0 }];
            setCityList([{ label: `-- ${t('city')} --`, value: 0 }])
            setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
            setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])
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
        let findProvince = provinceList.find((item) => item.value === provinceId)
        if (!findProvince) {
            setCityList([{ label: `-- ${t('city')} --`, value: 0 }])
            setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
            setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])

            setProvince('')
            setProvinceId('')
            setCityId('')
            setCity('')
            setDistrictId('')
            setDistrict('')
            setSubDistrict('')
            setSubDistrictId('')
            setPostalCode('')
            return;
        }

        setProvince(findProvince.label)
        setProvinceId(provinceId)
        setCityList([{ label: `-- ${t('city')} --`, value: 0 }])
        setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
        setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])
        getCityByProvinceId(provinceId)
        setCityId('')
        setCity('')
        setDistrictId('')
        setDistrict('')
        setSubDistrict('')
        setSubDistrictId('')
        setPostalCode('')
    }

    function getCityByProvinceId(provinceId) {
        GetCityByProvinceId(provinceId)
            .then((response) => {
                var cityData = []
                var _cityData = [{ label: `-- ${t('city')} --`, value: 0 }]
                setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
                setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])
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
        let findCity = cityList.find((item) => item.value === cityId)
        setCity(findCity.label)
        setCityId(cityId)
        setDistrictList([{ label: `-- ${t('district')} --`, value: 0 }])
        setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])
        getDistrictByCityId(cityId)
        setDistrictId('')
        setDistrict('')
        setSubDistrict('')
        setSubDistrictId('')
        setPostalCode('')
    }

    function getDistrictByCityId(cityId) {
        GetDistrictByCityId(cityId)
            .then((response) => {
                var districtData = []
                var _districtData = [{ label: `-- ${t('district')} --`, value: 0 }];
                setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])
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
        let findDistrict = districtList.find((item) => item.value === districtId)
        setDistrict(findDistrict.label)
        setDistrictId(districtId)
        setSubDistrictList([{ label: `-- ${t('sub_district')} --`, value: 0, postalCode: 0 }])
        getSubdistrictByDistrictId(districtId)
        setSubDistrict('')
        setSubDistrictId('')
        setPostalCode('')
    }

    function getSubdistrictByDistrictId(districtId) {
        GetSubDistrictByDistrictId(districtId)
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
        let findSubDistrict = subDistrictList.find((item) => item.value === subdistrictId)
        setSubDistrict(findSubDistrict.label)
        setPostalCode(findSubDistrict.postalCode)
        setSubDistrictId(subdistrictId)
    }

    function defaultValue() {
        setUserId('')
        setEmail('')
        setPhotoUrl('')
        setGroup('customer')
        setRole('')
        setFullName('')
        setFirstName('')
        setLastName('')
        setBirthDate('')
        setBirthPlace('')
        setGender('')
        setReligion('')
        setMotherName('')
        setPhoneNumber('')
        setAddress('')
        setSubDistrict('')
        setSubDistrictId('')
        setDistrict('')
        setDistrictId('')
        setCity('')
        setCityId('')
        setProvince('')
        setProvinceId('')
        setPostalCode('')
        setCardNumber('')
        setCompanyName('')

        setDisable(false)
        setStatus('active')
        setDeviceTokenId('')

        setFirstSignInAt(null)
        setLastSignInAt(null)

        setVisible(false)
        setAlertVisible(false)
        setAlertMessage('')
        setPageType('new')
        setDocuments([])
        setAlertRoleVisible(false)
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
        setCardNumber(value.cardNumber)
        setCompanyName(value.companyName)
        setDisable(value.disable)
        setStatus(value.status)
        setDeviceTokenId(value.deviceTokenId)
        setFirstSignInAt(value.firstSignInAt)
        setLastSignInAt(value.lastSignInAt)
        setDocumentList(value.documents)

        getCityByProvinceId(value.provinceId)
        getDistrictByCityId(value.cityId)
        getSubdistrictByDistrictId(value.districtId)
    }

    let findConfigPage = navigationList.find((e) => e.name.toLowerCase() === 'users')
    let findNavigate = findConfigPage.items.find((e) => e.name.toLowerCase() === 'customer')

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
                                            <b>{t('customer_menu')}</b>
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
                                            {t('add')} {t('customer')}
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
                                    data={customerList}
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


                        <CModalHeader closeButton={false}>
                            <CModalTitle>{pageType === 'new' ? `${t('add')} ${t('customer')}` : fullName}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CRow className="justify-content-center">
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
                                            src={photoUrl ? photoUrl : defaultImage}
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
                            </CRow>
                            <br></br>
                            <CForm>
                                <CRow>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-basic"
                                            label={t('email')}
                                            variant="standard"
                                            fullWidth
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            error={email.length === 0}
                                        />
                                    </CCol>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-basic"
                                            label="No Kartu"
                                            variant="standard"
                                            fullWidth
                                            error={cardNumber.length == 0}
                                            value={cardNumber}
                                            inputProps={
                                                {
                                                    readOnly: true
                                                }
                                            }
                                        />
                                    </CCol>
                                </CRow>
                                <br></br>
                                <CRow>
                                    <CCol xs={12} xl={6} sm={6} xxl={6} lg={6}>
                                        <PhoneInput
                                            international
                                            countryCallingCodeEditable={false}
                                            defaultCountry="ID"
                                            onChange={setPhoneNumber}
                                            value={phoneNumber}
                                            className={phoneNumber && isValidPhoneNumber(phoneNumber) ? 'input-active' : 'input-non-active'}
                                            style={{
                                                color: "#000000",
                                                fontSize: fontSize,
                                                borderBottom: '1px solid #000',
                                            }}
                                        />
                                    </CCol>
                                </CRow> <br />
                                <CRow>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-basic"
                                            label={t('first_name')}
                                            variant="standard"
                                            fullWidth
                                            onChange={(e) => setFirstName(e.target.value)}
                                            value={firstName}
                                            error={firstName.length === 0}
                                        />
                                    </CCol>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-basic"
                                            label={t('last_name')}
                                            variant="standard"
                                            fullWidth
                                            onChange={(e) => setLastName(e.target.value)}
                                            value={lastName}
                                        />
                                    </CCol>
                                </CRow> <br />
                                <CRow>
                                    <CCol xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <MobileDatePicker
                                                value={birthDate}
                                                disableUnderline
                                                onChange={(newValue) => setBirthDate(dayjs(newValue))}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        id="standard-basic"
                                                        label={t('birth_date')}
                                                        variant="standard"
                                                        fullWidth
                                                    />
                                                }
                                            />
                                        </LocalizationProvider>
                                    </CCol>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-basic"
                                            label={t('birth_place')}
                                            variant="standard"
                                            fullWidth
                                            onChange={(e) => setBirthPlace(e.target.value)}
                                            value={birthPlace}
                                        />
                                    </CCol>
                                </CRow> <br />
                                <CRow>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-select-currency"
                                            select
                                            label={t('gender')}
                                            variant="standard"
                                            fullWidth
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            {genderList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </CCol>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-select-currency"
                                            select
                                            label={t('religion')}
                                            variant="standard"
                                            fullWidth
                                            value={religion}
                                            onChange={(e) => setReligion(e.target.value)}
                                        >
                                            {religionList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </CCol>
                                </CRow> <br />

                                <CRow>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-select-currency"
                                            select
                                            label={t('province')}
                                            variant="standard"
                                            fullWidth
                                            value={provinceId}
                                            onChange={(e) => selectProvince(e.target.value)}
                                        >
                                            {provinceList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </CCol>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-select-currency"
                                            select
                                            label={t('city')}
                                            variant="standard"
                                            fullWidth
                                            value={cityId}
                                            disabled={provinceId ? false : true}
                                            onChange={(e) => selectCity(e.target.value)}
                                        >
                                            {cityList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </CCol>
                                </CRow> <br />

                                <CRow>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-select-currency"
                                            select
                                            label={t('district')}
                                            variant="standard"
                                            fullWidth
                                            value={districtId}
                                            disabled={cityId ? false : true}
                                            onChange={(e) => selectDistrict(e.target.value)}
                                        >
                                            {districtList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </CCol>
                                    <CCol xs={6}>
                                        <TextField
                                            id="standard-select-currency"
                                            select
                                            label={t('sub_district')}
                                            variant="standard"
                                            fullWidth
                                            value={subDistrictId}
                                            disabled={districtId ? false : true}
                                            onChange={(e) => selectSubDistrict(e.target.value)}
                                        >
                                            {subDistrictList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </CCol>
                                </CRow> <br />

                                <CRow>
                                    <CCol xs={12} xl={6} sm={6} xxl={6} lg={6}>
                                        <TextField
                                            id="standard-basic"
                                            label={t('zip_code')}
                                            variant="standard"
                                            fullWidth
                                            value={postalCode}
                                            inputProps={
                                                {
                                                    readOnly: true
                                                }
                                            }
                                        />
                                    </CCol>
                                </CRow> <br />
                                <CRow>
                                    <CCol xs={12} xl={6} sm={6} xxl={6} lg={6}>
                                        <TextField
                                            id="standard-basic"
                                            label={t('full_address')}
                                            variant="standard"
                                            fullWidth
                                            onChange={(e) => setAddress(e.target.value)}
                                            value={address}
                                            multiline
                                            rows={4}
                                            maxRows={4}
                                        />
                                    </CCol>
                                </CRow>
                                <br></br>
                                {
                                    rolePermissionEmployee.permissionStatus
                                        ?
                                        <CRow>
                                            <CCol xs={12} xl={6} sm={6} xxl={6} lg={6}>
                                                <TextField
                                                    id="standard-select-currency"
                                                    select
                                                    label={t('status')}
                                                    variant="standard"
                                                    fullWidth
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                >
                                                    {statusList.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </CCol>
                                        </CRow>
                                        :
                                        <CRow>
                                            <CCol xs={12} xl={6} sm={6} xxl={6} lg={6}>
                                                <TextField
                                                    id="standard-basic"
                                                    label={t('status')}
                                                    variant="standard"
                                                    fullWidth
                                                    value={statusPipe(status)}
                                                    inputProps={
                                                        {
                                                            readOnly: true
                                                        }
                                                    }
                                                />
                                            </CCol>
                                        </CRow>
                                } <br />
                                <br />
                                <CButton hidden={pageType === 'new'}
                                    onClick={resetPassword}
                                    style={{
                                        width: "100%",
                                        fontSize: fontSize,
                                        background: '#FEFA1D',
                                        color: '#000000',
                                        border: 'none'
                                    }}>
                                    atur ulang katasandi
                                </CButton>
                            </CForm>
                            <div className="document-section" hidden={pageType === 'new'}>
                                <div hidden={documentList.length === 0}>
                                    <CTable align="middle" className="mb-0 border" hover responsive>
                                        <CTableHead color="light">
                                            <CTableRow>
                                                <CTableHeaderCell>{t('file_name')}</CTableHeaderCell>
                                                <CTableHeaderCell>{t('action')}</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {documentList.map((item, index) => (
                                                <CTableRow v-for="item in tableItems" key={index}>
                                                    <CTableDataCell>
                                                        <h6>{item.name}</h6>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CButton color="secondary" onClick={(e) => openDocument(item)}>
                                                            {t('view')}
                                                        </CButton>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </div>

                        </CModalBody>
                        <CModalFooter>

                            <CButton hidden={pageType === 'edit'}
                                onClick={addData}
                                style={{
                                    background: '#00BBFF',
                                    color: '#FFFFFF',
                                    border: 'none'
                                }}>
                                {t('add_data')}
                            </CButton>

                            <CButton hidden={pageType === 'new'}
                                onClick={saveData}
                                style={{
                                    background: '#00BBFF',
                                    color: '#FFFFFF',
                                    border: 'none'
                                }}>
                                {t('save')}
                            </CButton>

                            <CButton color="secondary" onClick={() => setVisible(false)}
                                style={{
                                    background: '#FF0000',
                                    color: '#FFFFFF',
                                    border: 'none'
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

export default Customer
