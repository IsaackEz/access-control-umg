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
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [error, setError] = useState('')
  const [errorAuth, setErrorAuth] = useState('')
  const [visible, setVisible] = useState(false)
  const [auth, setAuth] = useState({
    token: '',
  })
  const [data, setData] = useState({
    username: '',
    password: '',
  })
  const navigate = useNavigate()

  const onChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value })
  }
  const onChangeAuth = ({ currentTarget: input }) => {
    setAuth({ ...auth, [input.name]: input.value })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const loginURL = process.env.REACT_APP_AXIOS_BASE_URL + '/admin/login'
      await axios.post(loginURL, data)
      setError('')
      const adminURL = process.env.REACT_APP_AXIOS_BASE_URL + `/admin/${data.username}`
      const userData = await axios.get(adminURL)

      localStorage.setItem(
        'adminData',
        JSON.stringify({
          id: userData.data._id,
          username: userData.data.username,
          name: userData.data.fullName,
          email: userData.data.email,
          tfa: userData.data.tfa,
        }),
      )
      if (!userData.data.tfa) {
        navigate('/dashboard')
        const cookies = new Cookies()
        cookies.set('session', userData.data._id, { path: '/', maxAge: 3600, secure: true })
      }
      setVisible(true)
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message)
      }
    }
  }
  const onSubmitToken = async (e) => {
    e.preventDefault()
    try {
      let token = localStorage.getItem('adminData')
      token = JSON.parse(token)
      const adminInfo = {
        token: auth.token,
        adminID: token.username,
      }
      const loginURL = process.env.REACT_APP_AXIOS_BASE_URL + '/admin/verify'
      await axios.post(loginURL, adminInfo)
      navigate('/dashboard')
      const cookies = new Cookies()
      cookies.set('session', token.id, { path: '/', maxAge: 3600, secure: true })
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setErrorAuth(error.response.data.message)
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

      <CModal
        alignment="center"
        visible={visible}
        onClose={() => {
          setVisible(false)
          setAuth('')
        }}
      >
        <CModalHeader>
          <CModalTitle>Codigo de Verificacion</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={onSubmitToken}>
          <CModalBody>
            <p className="text-medium-emphasis">
              Ingresa el codigo proporcionado por tu applicaicon
            </p>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput type="text" onChange={onChangeAuth} placeholder="Codigo" name="token" />
            </CInputGroup>
          </CModalBody>
          <CRow>
            <CCol xs={6}>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Cancelar
              </CButton>
            </CCol>
            <CCol>
              <CButton color="primary" className="px-4" type="submit">
                Enviar
              </CButton>
            </CCol>

            {errorAuth && <div>{errorAuth}</div>}
          </CRow>
        </CForm>
      </CModal>
    </div>
  )
}

export default Login
