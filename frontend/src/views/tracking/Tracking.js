import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import {
  CCard,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { io } from 'socket.io-client'
import student from 'src/assets/images/user/student.png'
import teacher from 'src/assets/images/user/teacher.png'
import guest from 'src/assets/images/user/guest.png'
import foreign from 'src/assets/images/user/foreign.png'

const Tables = () => {
  const [userData, setUserData] = useState([])

  const [visible, setVisible] = useState(false)
  const [recordsAll, setRecordsAll] = useState([])

  const socket = useRef(io.connect(process.env.REACT_APP_IO))

  const loadUserData = async () => {
    await axios
      .get('https://api.cinic.xyz/api/users')
      .then((res) => {
        setUserData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const loadAllRecords = async () => {
    await axios
      .get('https://api.cinic.xyz/api/records')
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

  return (
    <CCard className="mb-4">
      <CCardBody>
        <h5 className="card-title mb-2">Usuarios reportados con sintomas</h5>
        <hr className="mt-0" />
        <CRow>
          {userData.map((user, index) => {
            if (user.covid === true) {
              return (
                <CCol lg={4} key={index}>
                  <CCardBody>
                    <div
                      className="widget-statsTrack p-1"
                      onClick={() => {
                        setVisible(!visible)
                      }}
                    >
                      <CRow>
                        <img
                          className="imgUserStatTrack"
                          src={
                            user.userRol === 'Alumno' ? (
                              student
                            ) : user.userRol === 'Residente' ? (
                              foreign
                            ) : user.userRol === 'Maestro' ? (
                              teacher
                            ) : user.userRol === 'Invitado' ? (
                              guest
                            ) : (
                              <></>
                            )
                          }
                          alt=""
                        />
                        <h4 className="userTextLabelTrack">{user.name + ' ' + user.lastname}</h4>
                        <p className="labelRolTrack">{user.userRol}</p>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCol>
              )
            }
          })}
        </CRow>
      </CCardBody>
      <CModal
        backdrop="static"
        alignment="center"
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Ajustes</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>oks</p>
        </CModalBody>
      </CModal>
    </CCard>
  )
}

export default Tables
