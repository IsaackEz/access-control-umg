import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [error, setError] = useState('')
  const [data, setData] = useState({
    username: '',
    password: '',
  })
  const navigate = useNavigate()
  const onChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const URL = process.env.REACT_APP_AXIOS_BASE_URL + '/admin/login'
      const { data: res } = await axios.post(URL, data)
      navigate('/dashboard')
      console.log(res.message)
      const cookies = new Cookies()
      cookies.set('session', 'auth', { path: '/', maxAge: 3600, secure: true })
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message)
      }
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Inicia sesion</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        onChange={onChange}
                        placeholder="Usuario"
                        autoComplete="username"
                        name="username"
                        value={data.username}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={onChange}
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        name="password"
                        value={data.password}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol> */}
                      {error && <div>{error}</div>}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
