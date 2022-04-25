import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
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
import DataTable from 'react-data-table-component'
import { io } from 'socket.io-client'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Tables = () => {
  const [userData, setUserData] = useState([])
  const [recordsAll, setRecordsAll] = useState([])
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState({
    userID: '',
    userRole: '',
    name: '',
    lastname: '',
    email: '',
  })

  const socket = useRef(io.connect(process.env.REACT_APP_IO))
  const navigate = useNavigate()
  const loadUserData = async () => {
    await axios
      .get(process.env.REACT_APP_AXIOS_BASE_URL + '/api/users')
      .then((res) => {
        setUserData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const loadAllRecords = async () => {
    await axios
      .get(process.env.REACT_APP_AXIOS_BASE_URL + '/api/records/lastseen')
      .then((res) => {
        setRecordsAll(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    loadAllRecords()
    loadUserData()
    socket.current.on('newUser', () => {
      loadAllRecords()
      loadUserData()
    })
  }, [])

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: 'Matricula',
      selector: (row) => row.userID,
      sortable: true,
    },
    {
      name: 'Rol',
      selector: (row) => row.userRol,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Sintomas',
      selector: (row) => {
        if (row.covid) {
          return 'Si'
        } else {
          return 'No'
        }
      },
      sortable: true,
    },
    {
      name: 'Ultimo acceso',
      selector: (row) => {
        if (row.checkOutTime != null) {
          return row.checkOutTime
        } else {
          return 'No registro previo'
        }
      },
      sortable: true,
    },
    {
      name: '',
      selector: (row) => {
        return (
          <CRow>
            <CCol>
              <CButton
                onClick={() => setVisible(!visible)}
                className="btn btn-sm"
                type="button"
                color="primary"
                variant="outline"
              >
                Editar
              </CButton>
            </CCol>
            <CCol>
              <CButton className="btn btn-sm" type="button" color="danger" variant="outline">
                Eliminar
              </CButton>
            </CCol>
          </CRow>
        )
      },
      sortable: true,
    },
  ]

  const getNames = () => {
    let fullUser = userData.slice()
    recordsAll.forEach((names) => {
      fullUser.forEach((user) => {
        user['fullName'] = user.name + ' ' + user.lastname
        if (user.userID === names.userID) {
          if (names.checkOutTime != null) {
            user['checkOutTime'] = timeDifference(
              Date.now(),
              new Date(names.checkOutTime).getTime(),
            )
          } else if (names.records.recordOutTime != null) {
            user['checkOutTime'] = timeDifference(
              Date.now(),
              new Date(names.records.recordOutTime).getTime(),
            )
          } else if (names.records.recordInTime != null) {
            user['checkOutTime'] = timeDifference(
              Date.now(),
              new Date(names.records.recordInTime).getTime(),
            )
          }
        }
      })
    })
    return fullUser
  }

  const timeDifference = (current, previous) => {
    var msPerMinute = 60 * 1000
    var msPerHour = msPerMinute * 60
    var msPerDay = msPerHour * 24
    var msPerMonth = msPerDay * 30
    var msPerYear = msPerDay * 365

    var elapsed = current - previous

    if (elapsed < msPerMinute) {
      return 'Hace ' + Math.round(elapsed / 1000) + ' seg'
    } else if (elapsed < msPerHour) {
      return 'Hace ' + Math.round(elapsed / msPerMinute) + ' min'
    } else if (elapsed < msPerDay) {
      return 'Hace ' + Math.round(elapsed / msPerHour) + ' horas'
    } else if (elapsed < msPerMonth) {
      return 'Hace ' + Math.round(elapsed / msPerDay) + ' dias'
    } else if (elapsed < msPerYear) {
      return 'Hace ' + Math.round(elapsed / msPerMonth) + ' meses'
    } else {
      return 'Hace ' + Math.round(elapsed / msPerYear) + ' años'
    }
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
      }
      setVisible(true)
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message)
      }
    }
  }

  const onChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value })
  }

  return (
    <CRow>
      <CCard className=" mb-4">
        <CCardBody>
          <h5 className="card-title mb-2">Usuarios</h5>
          <hr className="mt-0" />
          <div className="containerTable">
            <DataTable columns={columns} data={getNames()} pagination rowsPerPage={15} responsive />
          </div>
          <CModal
            alignment="center"
            visible={visible}
            onClose={() => {
              setVisible(false)
            }}
          >
            <CModalHeader>
              <CModalTitle>Codigo de Verificacion</CModalTitle>
            </CModalHeader>
            <CForm onSubmit={onSubmit}>
              <CModalBody>
                <p className="text-medium-emphasis">
                  Ingresa el codigo proporcionado por tu applicaicon
                </p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput type="text" onChange={onChange} placeholder="Codigo" name="token" />
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

                {error && <div>{error}</div>}
              </CRow>
            </CForm>
          </CModal>
        </CCardBody>
      </CCard>
    </CRow>
  )
}

export default Tables
