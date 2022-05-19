import React, { useState, useEffect } from 'react'
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
import student from 'src/assets/images/user/student.png'
import teacher from 'src/assets/images/user/teacher.png'
import guest from 'src/assets/images/user/guest.png'
import foreign from 'src/assets/images/user/foreign.png'

const Tracking = () => {
  const [userData, setUserData] = useState([])
  const [onselect, setOnselect] = useState({})
  const [visible, setVisible] = useState(false)
  const [recordsAll, setRecordsAll] = useState([])

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
      .get(process.env.REACT_APP_AXIOS_BASE_URL + '/api/records')
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
  }, [])

  const userContact = (infUserID) => {
    let placesInfected = []
    let recordsIn = []
    recordsAll.forEach((records) => {
      if (
        records.userID === infUserID &&
        records.records[records.records.length - 1].recordInPlace !== ''
      ) {
        placesInfected = { records: records.records, userID: records.userID }
      }
    })
    if (placesInfected.records !== undefined) {
      placesInfected.records.forEach((placeInf) => {
        recordsAll.forEach((records) => {
          records.records.forEach((record) => {
            if (placeInf.recordInPlace === record.recordInPlace) {
              const placeInfOutDate =
                new Date(record.recordOutTime).getDate() +
                '-' +
                new Date(record.recordOutTime).getMonth() +
                '-' +
                new Date(record.recordOutTime).getFullYear()
              const recordOutDate =
                new Date(record.recordOutTime).getDate() +
                '-' +
                new Date(record.recordOutTime).getMonth() +
                '-' +
                new Date(record.recordOutTime).getFullYear()
              if (
                placeInfOutDate === recordOutDate &&
                new Date(record.recordInTime).getTime() <
                  new Date(placeInf.recordOutTime).getTime() &&
                new Date(placeInf.recordInTime).getTime() < new Date(record.recordOutTime).getTime()
              ) {
                recordsIn.push({ record: record, userID: records.userID })
              }
            }
          })
        })
      })
    }
    return { recordsIn }
  }

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
                        setOnselect(user)
                        userContact(user.userID)
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
                  <CModal
                    backdrop="static"
                    alignment="center"
                    visible={visible}
                    onClose={() => {
                      setVisible(false)
                    }}
                  >
                    <CModalHeader>
                      <CModalTitle>Contactos</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      {onselect.name && (
                        <div>
                          {userContact(onselect.userID).recordsIn.length !== 0 ? (
                            <p>
                              <strong>{onselect.name + ' ' + onselect.lastname}</strong> ha estado
                              en contacto con:
                            </p>
                          ) : (
                            <p>
                              <strong>{onselect.name + ' ' + onselect.lastname}</strong> por el
                              momento no ha tenido contactos.
                            </p>
                          )}

                          {userContact(onselect.userID).recordsIn.map((item, index) => {
                            return userData.map((user) => {
                              if (user.userID === item.userID) {
                                return (
                                  <div key={index}>
                                    {onselect.name !== user.name ? (
                                      <div className="infectedPP">
                                        <h5>{user.name + ' ' + user.lastname}</h5>
                                        <p>
                                          {'En ' +
                                            item.record.recordInPlace +
                                            ' el dia ' +
                                            new Date(item.record.recordOutTime).getDate() +
                                            '/' +
                                            new Date(item.record.recordOutTime).getMonth() +
                                            '/' +
                                            new Date(item.record.recordOutTime).getFullYear()}
                                        </p>
                                        <hr className="mt-0" />
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                )
                              }
                            })
                          })}
                        </div>
                      )}
                    </CModalBody>
                  </CModal>
                </CCol>
              )
            }
          })}
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default Tracking
