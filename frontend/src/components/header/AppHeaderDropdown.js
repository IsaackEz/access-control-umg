import React, { useState, useRef } from 'react'
import axios from 'axios'
import QRCode from 'qrcode'
import PWD from '../../views/pages/register/PWDRequisite'

import {
  CAvatar,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCollapse,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
  CModalHeader,
  CModalTitle,
  CRow,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import {
  cilAddressBook,
  cilBell,
  cilLockLocked,
  cilPencil,
  cilSettings,
  cilUser,
  cilX,
} from '@coreui/icons'

import Cookies from 'universal-cookie'

import CIcon from '@coreui/icons-react'
import admin from 'src/assets/images/user/admin.png'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [error, setError] = useState('')
  const [src, setSrc] = useState('')
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [profile, setProfile] = useState(false)
  const [auth, setAuth] = useState({
    token: '',
  })
  const [errorR, setErrorR] = useState('')
  const [pwdRequisite, setPWDRequisite] = useState(false)
  const [check, setCheck] = useState({
    lowerCase: false,
    capsLetters: false,
    num: false,
    len: false,
    specialChar: false,
  })
  const [data, setData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
  })
  const [newUsername, setNewUsername] = useState(true)

  const navigate = useNavigate()

  let adminInfo = localStorage.getItem('adminData')
  adminInfo = JSON.parse(adminInfo)

  const onChangeAuth = ({ currentTarget: input }) => {
    setAuth({ ...auth, [input.name]: input.value })
  }

  const onSubmitToken = async (e) => {
    e.preventDefault()
    try {
      let token = localStorage.getItem('adminData')
      token = JSON.parse(token)

      const adminInfo = {
        adminID: token.username,
        token: auth.token,
      }
      const loginURL = process.env.REACT_APP_AXIOS_BASE_URL + '/admin/verify'
      const updateTFA = process.env.REACT_APP_AXIOS_BASE_URL + `/admin/${token.username}`
      await axios.post(loginURL, adminInfo)
      await axios.post(updateTFA, { tfa: !adminInfo.tfa })
      setVisible(false)
      localStorage.setItem(
        'adminData',
        JSON.stringify({
          id: token.id,
          username: token.username,
          name: token.name,
          tfa: !adminInfo.tfa,
        }),
      )
      addToast(enabledTFA)
      setAuth('')
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message)
      }
    }
  }

  const enableTFA = async () => {
    const adminURL = process.env.REACT_APP_AXIOS_BASE_URL + `/admin/${adminInfo.username}`
    const userData = await axios.get(adminURL)
    QRCode.toDataURL(userData.data.secret.otpauth_url).then(setSrc)
  }

  const disableTFA = async () => {
    let token = localStorage.getItem('adminData')
    token = JSON.parse(token)
    const updateTFA = process.env.REACT_APP_AXIOS_BASE_URL + `/admin/${token.username}`
    await axios.post(updateTFA, { tfa: !token.tfa })
    setVisible(false)
    localStorage.setItem(
      'adminData',
      JSON.stringify({
        id: token.id,
        username: token.username,
        name: token.name,
        tfa: !token.tfa,
      }),
    )
    addToast(disabledTFA)
  }

  const logOut = () => {
    const cookies = new Cookies()
    cookies.remove('session')
    localStorage.removeItem('adminData')
    navigate('/login')
  }

  const enabledTFA = (
    <CToast title="2FA enabled">
      <CToastHeader close>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#008000"></rect>
        </svg>
        <strong className="me-auto">Verificacion de 2 pasos</strong>
      </CToastHeader>
      <CToastBody>2FA Habilitado</CToastBody>
    </CToast>
  )

  const disabledTFA = (
    <CToast title="2FA disbled">
      <CToastHeader close>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#FF0000"></rect>
        </svg>
        <strong className="me-auto">Verificacion de 2 pasos</strong>
      </CToastHeader>
      <CToastBody>2FA Deshabilitado</CToastBody>
    </CToast>
  )

  // const handleOnKeyUp = (e) => {
  //   const { value } = e.target
  //   const capsLetters = /[A-Z]/.test(value)
  //   const lowerCase = /[a-z]/.test(value)
  //   const num = /[0-9]/.test(value)
  //   const len = value.length >= 8
  //   const specialChar = /[$-/:-?{-~!"^_`[\]]/.test(value)
  //   setCheck({ capsLetters, lowerCase, num, len, specialChar })
  // }

  // const handleOnBlur = () => {
  //   setPWDRequisite(false)
  // }

  // const handleOnFocus = () => {
  //   setPWDRequisite(true)
  // }

  // const onChange = ({ currentTarget: input }) => {
  //   setData({ ...data, [input.name]: input.value })
  // }

  const updateUsername = () => {}

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const URL = process.env.REACT_APP_AXIOS_BASE_URL + '/admin/signup'
      const { data: res } = await axios.post(URL, data)
      navigate('/usuarios')
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message)
      }
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={admin} size="md" /> {adminInfo.username}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/*<CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
         <CDropdownItem component="button">
          <CIcon icon={cilBell} className="me-2" />
          Notificaciones
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}

        <CDropdownHeader className="bg-light fw-semibold py-2">Ajustes</CDropdownHeader>
        <CDropdownItem
          component="button"
          onClick={() => {
            setProfile(!profile)
          }}
        >
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem
          component="button"
          onClick={() => {
            setVisible(!visible)
          }}
        >
          <CIcon icon={cilSettings} className="me-2" />
          Ajustes
        </CDropdownItem>

        <CModal
          backdrop="static"
          alignment="center"
          visible={visible}
          onClose={() => {
            setVisible(false)
            setVisible2(false)
            setAuth('')
          }}
        >
          <CModalHeader>
            <CModalTitle>Ajustes</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {adminInfo.tfa ? (
              <CRow>
                <CCol xs="auto" className="me-auto">
                  2FA activado
                </CCol>
                <CCol xs="auto">
                  <CButton
                    color="danger"
                    onClick={() => {
                      setVisible2(!visible2)
                      disableTFA()
                    }}
                  >
                    Desactivar 2FA
                  </CButton>
                </CCol>
              </CRow>
            ) : (
              <CModalBody>
                <CRow>
                  <CCol xs="auto" className="me-auto">
                    2FA desactivado
                  </CCol>
                  <CCol xs="auto">
                    <CButton
                      color="success"
                      onClick={() => {
                        setVisible2(!visible2)
                        enableTFA()
                      }}
                    >
                      Activar 2FA
                    </CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCollapse visible={visible2}>
                    <CCard className="mt-3">
                      <CCardBody>
                        <div className="qrtoken">
                          <h5>Escanea el codigo</h5>
                          <img src={src} alt="" />
                        </div>
                        <CForm onSubmit={onSubmitToken}>
                          <CRow>
                            <CCol className="mb-4">
                              <CFormInput
                                className="tokeninput"
                                type="text"
                                onChange={onChangeAuth}
                                placeholder="Codigo"
                                name="token"
                              />
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol xs={8}>
                              <CButton
                                color="secondary"
                                onClick={() => {
                                  setVisible(false)
                                  setVisible2(false)
                                  setError('')
                                }}
                              >
                                Cancelar
                              </CButton>
                            </CCol>
                            <CCol lg="auto">
                              <CButton color="primary" className="px-4" type="submit">
                                Verificar
                              </CButton>
                            </CCol>
                            {error && <div>{error}</div>}
                          </CRow>
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CCollapse>
                </CRow>
              </CModalBody>
            )}
          </CModalBody>
        </CModal>
        <CModal
          backdrop="static"
          alignment="center"
          visible={profile}
          onClose={() => {
            setProfile(false)
          }}
        >
          <CModalHeader>
            <CModalTitle>Perfil</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={onSubmit}>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  name="username"
                  placeholder={adminInfo.username}
                  readOnly={newUsername}
                />
                <CButton
                  type="button"
                  color="primary"
                  variant="outline"
                  onClick={() => {
                    setNewUsername(!newUsername)
                  }}
                >
                  {newUsername ? <CIcon icon={cilPencil} /> : <CIcon icon={cilX} />}
                </CButton>
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput readOnly type="password" name="password" value="00000000000" />
                <CButton type="button" color="primary" variant="outline">
                  <CIcon icon={cilPencil} />
                </CButton>
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilAddressBook} />
                </CInputGroupText>
                <CFormInput readOnly name="fullName" value={adminInfo.name} />
                <CButton type="button" color="primary" variant="outline">
                  <CIcon icon={cilPencil} />
                </CButton>
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>@</CInputGroupText>
                <CFormInput readOnly name="email" value={adminInfo.email} />
                <CButton type="button" color="primary" variant="outline">
                  <CIcon icon={cilPencil} />
                </CButton>
                {errorR && <div>{errorR}</div>}
              </CInputGroup>
              <div className="d-grid">
                <CButton color="success" type="submit">
                  Editar cuenta
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>
        <CDropdownDivider />
        <CDropdownItem onClick={logOut}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Cerrar Sesion
        </CDropdownItem>
      </CDropdownMenu>

      <CToaster ref={toaster} push={toast} placement="bottom-start" />
    </CDropdown>
  )
}

export default AppHeaderDropdown
