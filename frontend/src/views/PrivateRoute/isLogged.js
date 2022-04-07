import React from 'react'
import Cookies from 'universal-cookie'
import { Navigate } from 'react-router-dom'
// eslint-disable-next-line react/prop-types
const PrivRoute = ({ children }) => {
  const cookies = new Cookies()

  return cookies.get('session') ? <Navigate to="/dashboard" /> : children
}

export default PrivRoute
