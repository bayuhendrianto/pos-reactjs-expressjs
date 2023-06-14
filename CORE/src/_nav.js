import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilSettings,
  cilCarAlt,
  cilMedicalCross,
  cilBuilding,
  cilCart,
  cilAudioDescription,
  cilWallet,
  cilBookmark,
  cilArrowThickToBottom,
  cilArrowThickToTop,
  cilStorage,
  cilBook,
  cilPlus
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    i18n: 'dashboard_menu',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Company',
    i18n: 'company_menu',
    to: '/company',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Booking',
    i18n: 'booking_menu',
    to: '/booking',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Products',
    i18n: 'product_menu',
    to: '/product',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Manage Stock',
    i18n: 'manage_stock_menu',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Stock',
        i18n: 'stock_menu',
        to: '/stock',
        icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Stock In',
        i18n: 'stock_in_menu',
        to: '/stock-in',
        icon: <CIcon icon={cilArrowThickToBottom} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Stock Out',
        i18n: 'stock_out_menu',
        to: '/stock-out',
        icon: <CIcon icon={cilArrowThickToTop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Stock',
        i18n: 'add_stock_menu',
        to: '/purchase-order',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Transactions',
    i18n: 'transaction_menu',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cashier',
        i18n: 'cashier_menu',
        to: '/cashier',
        icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Transaction Summary',
        i18n: 'transaction_summary_menu',
        to: '/transaction-summary',
        icon: <CIcon icon={cilBookmark} customClassName="nav-icon" />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Users',
    i18n: 'user_menu',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Employee',
        i18n: 'employee_menu',
        to: '/employee',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Supplier',
        i18n: 'supplier_menu',
        to: '/supplier',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Customer',
        i18n: 'customer_menu',
        to: '/customer',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Configuration',
    i18n: 'configuration_menu',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Category',
        i18n: 'kategori',
        to: '/category',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Unit',
        i18n: 'unit',
        to: '/unit',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Vehicle Category',
        i18n: 'vehicle_category_menu',
        to: '/vehicle-category',
        icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Advertisement',
      //   i18n: 'advertisement_menu',
      //   to: '/advertisement',
      //   icon: <CIcon icon={cilAudioDescription} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Setting',
      //   i18n: 'setting_menu',
      //   to: '/setting',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
    ]
  },
  {
    component: CNavItem,
    name: 'Role',
    i18n: 'role_menu',
    to: '/role',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Wallet',
    i18n: 'wallet_menu',
    to: '/wallet',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  }
]

export default _nav
