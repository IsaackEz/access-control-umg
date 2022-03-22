import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Historial = React.lazy(() => import('./views/records/Records'))
const Traffic = React.lazy(() => import('./views/traffic/Traffic'))
const Usuarios = React.lazy(() => import('./views/users/Users'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/historial', name: 'Historial', element: Historial },
  { path: '/traffic', name: 'Traffic', element: Traffic },
  { path: '/usuarios', name: 'Usuarios', element: Usuarios },
]

export default routes
