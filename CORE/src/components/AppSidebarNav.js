import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export const AppSidebarNav = ({ items }) => {
  const fontSize = Number(useSelector((state) => state.fontSizeNavBar))

  const location = useLocation()
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { t } = useTranslation();
    const { component, name, i18n, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component style={{fontSize: fontSize}}
        {...(rest.to &&
          !rest.items && {
          component: NavLink,
        })}
        key={index}
        {...rest}
      >
        {navLink(t(i18n), icon, badge)}
      </Component>
    )
  }
  const navGroup = (item, index) => {
    const { t } = useTranslation();
    const { component, name, i18n, icon, to, ...rest } = item
    const Component = component
    return (
      <Component style={{fontSize: fontSize}}
        idx={String(index)}
        key={index}
        toggler={navLink(t(i18n), icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
