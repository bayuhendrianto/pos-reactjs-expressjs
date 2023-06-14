import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const navigate = useNavigate()
  const location = useLocation()

  const getRouteName = (pathname, routes) => {
    var _currentRoute
    var pathnameLength = pathname.split('/')

    if (pathnameLength.length > 2) {
      _currentRoute = routes.find((route) => route.path === `/${pathnameLength[1]}/:id`)
    } else {
      _currentRoute = routes.find((route) => route.path === pathname)
    }

    return _currentRoute ? _currentRoute.name : (_currentRoute = false)
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <>
      {/* <CBreadcrumb className="m-0 ms-2">
        <CBreadcrumbItem onClick={() => navigate(-1)}>Home</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          )
        })}
      </CBreadcrumb> */}

      <div hidden={location.pathname.split('/')[1] !== 'booking-detail'}>
        <CButton color="primary" variant="outline" size="sm" onClick={() => navigate(-1)}>
          <CIcon icon={cilArrowLeft} /> BACK
        </CButton>
      </div>
    </>
  )
}

export default React.memo(AppBreadcrumb)
