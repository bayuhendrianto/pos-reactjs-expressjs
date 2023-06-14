import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
// import logo from '../assets/logo-black.png'
import { useEffect } from 'react'

import axion from '../services/api'
import { useState } from 'react'
import { NotificationModelList } from '../models/notification.class'

import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "../firebase-config"

import i18next from "i18next";

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const company = useSelector((state) => state.company)
  const navigate = useNavigate()
  const [notificationCount, setNotificationCount] = useState(0)
  const [title, setTitle] = useState(globalThis.localStorage.getItem('lng') || 'id')

  useEffect(() => {
    // getNotification(),
    // getNotificationFirebase()
  }, [])

  const getNotificationFirebase = () => {
    let col = collection(firestore, "notifications")
    const q = query(col,
      where("isOpen", "==", false),
      where("companyId", "==", company.id),
      orderBy("createdAt", "desc"),
      limit(20));

    onSnapshot(q, (a) => {
      let data = new Array()
      a.forEach((d) => {
        data.push(d.data())
      })
      setNotificationCount(data.length)
    })
  }

  const getNotification = () => {
    axion({
      url: `/notification//get-by-companyId/${company.id}`,
      method: 'get',
    })
      .then((response) => {
        let notifList = new NotificationModelList(response.data.result);
        let findNotifIsNotOpen = notifList.filter((item) => item.isOpen === false);
        setNotificationCount(findNotifIsNotOpen.length)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const changeLanguage = (value) => {
    setTitle(value)
    globalThis.localStorage.setItem('lng', value)
    i18next.changeLanguage(value)
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {/* <img className="sidebar-brand-full" src={logo} width={70}></img> */}
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink></CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>|</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>
              <b>{company.name}</b>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CDropdown >
            <CDropdownToggle
              style={{
                background: '#00BBFF',
                color: '#FFFFFF',
                border: 'none'
              }} size="sm">
              {String(title).toUpperCase()}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => changeLanguage('id')}>ID</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('en')}>EN</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink onClick={() => navigate('/notification')}>
              <div style={{ cursor: 'pointer' }}>
                <CIcon icon={cilBell} size="lg" />
                <CBadge
                  style={{
                    background: '#00BBFF',
                    color: '#FFFFFF',
                    border: 'none'
                  }}>{notificationCount}</CBadge>
              </div>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
