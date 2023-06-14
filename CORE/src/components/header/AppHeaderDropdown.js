import React, { useEffect } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useSelector } from 'react-redux'

import defaultImage from '../../assets/boss.png'
import { useNavigate } from 'react-router-dom'
import { User } from '../../models/user.class'
import { useState } from 'react'
import axios from '../../services/api'

const AppHeaderDropdown = () => {
  const user = useSelector((state) => state.user)
  const [userData, setUserData] = useState(new User())
  const navigate = useNavigate()

  useEffect(() => {
    GetById()
  }, []);

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

  function signOut() {
    globalThis.sessionStorage.clear()
    globalThis.location.reload()
  }

  const viewProfile = () => {
    navigate(`/profile`)
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={userData.photoUrl} alt={user.fullName} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem onClick={viewProfile} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          {userData.fullName}
        </CDropdownItem>
        <CDropdownItem onClick={signOut} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          {/* Sign Out */}
          Keluar
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
