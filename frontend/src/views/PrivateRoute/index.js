import React from 'react'
import Cookies from 'universal-cookie'
import { Navigate } from 'react-router-dom'
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const cookies = new Cookies()

  return cookies.get('session') ? children : <Navigate to="/login" />
}

export default PrivateRoute
