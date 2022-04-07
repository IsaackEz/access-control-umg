import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilAddressBook } from '@coreui/icons'
import PWD from './PWDRequisite'

const Register = () => {
  const [error, setError] = useState('')
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

  const handleOnKeyUp = (e) => {
    const { value } = e.target
    const capsLetters = /[A-Z]/.test(value)
    const lowerCase = /[a-z]/.test(value)
    const num = /[0-9]/.test(value)
    const len = value.length >= 8
    const specialChar = /[$-/:-?{-~!"^_`[\]]/.test(value)
    setCheck({ capsLetters, lowerCase, num, len, specialChar })
  }

  const handleOnBlur = () => {
    setPWDRequisite(false)
  }

  const handleOnFocus = () => {
    setPWDRequisite(true)
  }

  const navigate = useNavigate()

  const onChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const cookies = new Cookies()
      const URL = process.env.REACT_APP_AXIOS_BASE_URL + '/admin/signup'
      const { data: res } = await axios.post(URL, data)
      console.log(cookies.get('session'))
      navigate('/dashboard')
      console.log(res.message)
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
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={onSubmit}>
                  <h1>Registro</h1>
                  <p className="text-medium-emphasis">Crear cuenta</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Usuario"
                      autoComplete="username"
                      name="username"
                      onChange={onChange}
                      value={data.username}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      name="password"
                      onChange={onChange}
                      onFocus={handleOnFocus}
                      onBlur={handleOnBlur}
                      onKeyUp={handleOnKeyUp}
                      value={data.password}
                      required
                    />
                  </CInputGroup>
                  {pwdRequisite ? (
                    <PWD
                      capsLettersFlag={check.capsLetters ? 'valid' : 'invalid'}
                      lowerCaseFlag={check.lowerCase ? 'valid' : 'invalid'}
                      numFlag={check.num ? 'valid' : 'invalid'}
                      lenFlag={check.len ? 'valid' : 'invalid'}
                      specialCharFlag={check.specialChar ? 'valid' : 'invalid'}
                    />
                  ) : null}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilAddressBook} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Nombre completo"
                      autoComplete="fullName"
                      name="fullName"
                      onChange={onChange}
                      value={data.fullName}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      onChange={onChange}
                      value={data.email}
                      required
                    />
                    {error && <div>{error}</div>}
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Crear cuenta
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
