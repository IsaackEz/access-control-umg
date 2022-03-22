import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilSpeedometer, cilHistory, cilGraph } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Historial',
    to: '/historial',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Traffic',
    to: '/traffic',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/usuarios',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
