import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Main Page
const Company = React.lazy(() => import('./views/main/Company/Company'))
const Customer = React.lazy(() => import('./views/main/Customer/Customer'))
const Supplier = React.lazy(() => import('./views/main/Supplier/Supplier'))
const Employee = React.lazy(() => import('./views/main/Employee/Employee'))
const Role = React.lazy(() => import('./views/main/Role/Role'))
const User = React.lazy(() => import('./views/main/User/User')) 
const Booking = React.lazy(() => import('./views/main/Booking/Booking'))
const Advertisement = React.lazy(() => import('./views/main/Advertisement/Advertisement'))
const Profile = React.lazy(() => import('./views/main/Profile/Profile'))
const BookingDetail = React.lazy(() => import('./views/main/Booking/BookingDetail'))
const Notification = React.lazy(() => import('./views/main/Notification/Notification'))
const Setting = React.lazy(() => import('./views/main/Settings/Settings'))

// Wallet
const Wallet = React.lazy(() => import('./views/main/Wallet/Wallet'))
const BankAccount = React.lazy(() => import('./views/main/Wallet/BankAccount'))
const BankAccountDetail = React.lazy(() => import('./views/main/Wallet/BankAccountDetail'))
const Income = React.lazy(() => import('./views/main/Wallet/Income'))
const IncomeDetail = React.lazy(() => import('./views/main/Wallet/IncomeDetail'))
const Withdrawal = React.lazy(() => import('./views/main/Wallet/Withdrawal'))
const WithdrawalDetail = React.lazy(() => import('./views/main/Wallet/WithdrawalDetail'))

const Category = React.lazy(() => import('./views/main/Category//Category'))
const Unit = React.lazy(() => import('./views/main/Unit/Unit'))
const Product = React.lazy(() => import("./views/main/Products/Product"))
const Stock = React.lazy(() => import("./views/main/Stock/Stock/Stock"))
const StockIn = React.lazy(() => import("./views/main/Stock/StockIn/StockIn"))
const StockInDetail = React.lazy(() => import("./views/main/Stock/StockIn/StockInDetail"))
const StockOut = React.lazy(() => import("./views/main/Stock/StockOut/StockOut"))
const StockOutDetail = React.lazy(() => import("./views/main/Stock/StockOut/StockOutDetail"))
const PurchaseOrder = React.lazy(() => import("./views/main/PurchaseOrder/PurchaseOrder"))
const PurchaseOrderDetail = React.lazy(() => import("./views/main/PurchaseOrder/PurchaseOrderDetail"))
const Cashier = React.lazy(() => import("./views/main/Cashier/Cashier"))
const TransactionSummary = React.lazy(() => import("./views/main/TransactionSummary/TransactionSummary"))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  // Main Page
  { path: '/company', name: 'Companies', element: Company },
  { path: '/customer', name: 'Customers', element: Customer },
  { path: '/supplier', name: 'Suppliers', element: Supplier },
  { path: '/employee', name: 'Employees', element: Employee },
  { path: '/role', name: 'Roles', element: Role },
  { path: '/user', name: 'Users', element: User },
  { path: '/booking', name: 'Booking', element: Booking },
  { path: '/advertisement', name: 'Advertisement', element: Advertisement },
  { path: '/setting', name: 'Setting', element: Setting },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/booking-detail/:id/:scheduleId', name: 'Booking Detail', element: BookingDetail },
  { path: '/notification', name: 'Notification', element: Notification },

  // Wallet
  { path: '/wallet', name: 'Wallet', element: Wallet },
  { path: '/bank-account', name: 'BankAccount', element: BankAccount },
  { path: '/bank-account-detail', name: 'BankAccountDetail', element: BankAccountDetail },
  { path: '/income', name: 'Income', element: Income },
  { path: '/income-detail', name: 'IncomeDetail', element: IncomeDetail },
  { path: '/withdrawal', name: 'Withdrawal', element: Withdrawal },
  { path: '/withdrawal-detail', name: 'WithdrawalDetail', element: WithdrawalDetail },

  { path: '/category', name: 'Category', element: Category },
  { path: '/unit', name: 'Unit', element: Unit },
  { path: '/product', name: 'Product', element: Product },
  { path: '/stock', name: 'Stock', element: Stock },
  { path: '/stock-in', name: 'StockIn', element: StockIn },
  { path: '/stock-in/:id/:type', name: 'StockIn', element: StockInDetail },
  { path: '/stock-out', name: 'StockOut', element: StockOut },
  { path: '/stock-out/:id', name: 'StockOut', element: StockOutDetail },
  { path: '/purchase-order', name: 'Add Stock', element: PurchaseOrder },
  { path: '/purchase-order/:id', name: 'Add Stock', element: PurchaseOrderDetail },
  { path: '/cashier', name: 'Cashier', element: Cashier },
  { path: '/transaction-summary', name: 'Transaction Summary', element: TransactionSummary },
]

export default routes
