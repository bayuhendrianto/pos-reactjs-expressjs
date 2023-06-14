import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import './style.scss'
import axios from '../../../services/api'

// import Logo from '../../../assets/logo-black.png'

import moment from 'moment'
import { useNavigate } from 'react-router-dom'

import { collection, onSnapshot, query, where, orderBy, limit, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase-config"
import { CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { cilMenu } from '@coreui/icons'

const Notification = () => {
  let company = useSelector((state) => state.company)
  const navigate = useNavigate()
  let [notificationList, setNotificationList] = useState(new Array())

  useEffect(() => {
    setNotificationList(new Array());
    getNotification();
    // getNotificationFirebase();
  }, [])

  const getNotificationFirebase = () => {
    let col = collection(firestore, "notifications")
    const queryNotification = query(col,
      where("companyId", "==", company.id),
      orderBy("createdAt", "desc"),
      limit(20));

    onSnapshot(queryNotification, (notificationList) => {
      let data = new Array()
      notificationList.forEach((item) => {
        data.push(item.data())
      })
      setNotificationList(data)
      console.log(data)
    })
  }

  const getNotification = () => {
    axios({
      url: `/notification`,
      method: 'get',
    })
      .then((response) => {
        console.log(response)
        setNotificationList(response.data.result)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function openNotification(item) {
    console.log(item)
    if (item.isOpen === false) {
      updateData(item).then(() => {
        console.log('Hello update')
        if (item.type === 'booking') {
          navigate(`/booking-detail/${item.dataId}`)
        }
      }).catch((error) => {
        console.log(error)
      })
      // axios({
      //   url: `/notification/open/${item.id}`,
      //   method: 'put',
      // }).then(() => {
      //   if (item.type === 'booking') {
      //     navigate(`/booking-detail/${item.dataId}`)
      //   }
      // })
    } else {
      if (item.type === 'booking') {
        navigate(`/booking-detail/${item.dataId}`)
      }
    }
  }

  function updateData(data) {
    data.isOpen = true;
    data.createdAt = new Date(data.createdAt["seconds"] * 1000)
    data = Object.assign(data)

    console.log(data)
    return new Promise((resolve, reject) => {
      // let col = collection(firestore, "notifications")
      const notifRef = doc(firestore, "notifications", data.id);
      console.log(notifRef)
      updateDoc(notifRef, data).then(() => {
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="box shadow-sm rounded bg-white mb-3">
              <div className="box-title border-bottom p-3">
                <div class="d-flex justify-content-between">
                  <h6 className="m-0">Recent updates</h6>
                  {/* <h6><i class="fa fa-bars" style={{cursor:'pointer'}}></i></h6> */}
                  <CDropdown variant="btn-group">
                    <CDropdownToggle color="secondary" size="sm" caret={false}>
                      <CIcon icon={cilMenu}></CIcon>
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>Action</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </div>
              {notificationList.map((item, index) => {
                return (
                  <div key={index} onClick={() => openNotification(item)}>
                    <div className="box-body p-0">
                      <div
                        className="p-3 d-flex align-items-center border-bottom osahan-post-header"
                        style={!item.isOpen ? { background: '#f2f8ff' } : { background: '' }}
                      >
                        {/* <div className="dropdown-list-image mr-3">
                          <img src={Logo} alt="" />
                        </div> */}
                        <div className="font-weight-bold mr-3">
                          <div className="text-truncate">{item.name}</div>
                          <div className="small">{item.messages}</div>
                          <div className="small" style={{ fontSize: '12px' }}>

                            {moment(new Date(
                              item.createdAt.hasOwnProperty('seconds')
                                ? item.createdAt['seconds'] * 1000
                                : item.createdAt
                            )).fromNow()}
                          </div>
                        </div>
                        <span className="ml-auto mb-auto" hidden={item.isOpen}>
                          <div
                            className="text-right text-primary pt-1"
                            style={{ fontSize: '12px' }}
                          >
                            New
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notification
