import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import DateFnsUtils from '@date-io/date-fns'
import esLocale from 'date-fns/locale/es'
import ReactPaginate from 'react-paginate'

import { CCol, CRow, CToast, CToastBody, CToaster } from '@coreui/react'
import { io } from 'socket.io-client'
import student from 'src/assets/images/user/student.png'
import teacher from 'src/assets/images/user/teacher.png'
import guest from 'src/assets/images/user/guest.png'
import foreign from 'src/assets/images/user/foreign.png'
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers'

const Tables = () => {
  const [userData, setUserData] = useState([])
  const [recordsAll, setRecordsAll] = useState([])
  const socket = useRef(io.connect(process.env.REACT_APP_IO))

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
    socket.current.on('newUser', () => {
      loadAllRecords()
      loadUserData()
    })
  }, [])

  const getNames = () => {
    let fullRecords = JSON.parse(JSON.stringify(recordsAll))
    userData.forEach((names) => {
      fullRecords.forEach((record) => {
        if (names.userID === record.userID) {
          record['fullName'] = names.name + ' ' + names.lastname
          record['userRol'] = names.userRol
          record['covid'] = names.covid
          record['date'] = record.checkInTime
          record['checkInTime'] = tConvert(record.checkInTime.slice(11, 19))
          if (record.checkOutTime != null) {
            record['checkOutTime'] = tConvert(record.checkOutTime.slice(11, 19))
          }
        }
      })
    })
    fullRecords.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    return fullRecords
  }
  const tConvert = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]
    if (time.length > 1) {
      time = time.slice(1)
      time[5] = +time[0] < 12 ? ' AM' : ' PM'
      time[0] = +time[0] % 12 || 12
    }
    return time.join('')
  }

  const [page, setPage] = useState(0)

  const recordsPerPage = 5
  const recordsVisited = page * recordsPerPage

  const displayRecords = getNames()
    .slice(recordsVisited, recordsVisited + recordsPerPage)
    .map((data, i) => {
      return (
        <div key={i}>
          <CToast autohide={false} visible={true}>
            <CToastBody>
              <CRow>
                <CCol lg={2}>
                  {data.userRol === 'Alumno' ? (
                    <img className="imgUserRec" src={student} alt="" />
                  ) : data.userRol === 'Maestro' ? (
                    <img className="imgUserRec" src={teacher} alt="" />
                  ) : data.userRol === 'Residente' ? (
                    <img className="imgUserRec" src={foreign} alt="" />
                  ) : data.userRol === 'Invitado' ? (
                    <img className="imgUserRec" src={guest} alt="" />
                  ) : (
                    <></>
                  )}
                </CCol>
                <CCol lg="auto">
                  <div className="userNameTrack ms-2">
                    <p>
                      <strong>{data.userID}</strong>
                      {data.covid === true ? (
                        <span className="statusIna"></span>
                      ) : (
                        <span className="statusAct"></span>
                      )}
                    </p>
                    <p>{data.fullName}</p>
                  </div>
                </CCol>
              </CRow>

              <CCol lg="auto">
                <CRow>
                  <CCol lg={3}>
                    <strong>Entrada</strong>
                    <p>
                      Ingreso por <strong>{data.checkInPlace}</strong> a las{' '}
                      <strong>{data.checkInTime}</strong>
                    </p>
                  </CCol>
                  <CCol lg={3}>
                    <strong>Salida</strong>
                    {data.checkOutPlace !== '' ? (
                      <p>
                        Salio por <strong>{data.checkOutPlace}</strong> a las{' '}
                        <strong>{data.checkOutTime}</strong>
                      </p>
                    ) : (
                      <p>Sigue dentro de la UMG</p>
                    )}
                  </CCol>
                  <CCol lg={3}>
                    <strong>Historial</strong>
                    {data.records.map((record) => {
                      return record.recordInPlace !== '' && record.recordOutTime !== null ? (
                        <CRow>
                          <CCol lg={4}>
                            <p>{record.recordInPlace}</p>
                          </CCol>
                          <CCol lg="auto">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                              <TimePicker
                                name="recordInTime"
                                value={new Date(record.recordInTime).getTime() + 18000000}
                                readOnly={true}
                              />
                            </MuiPickersUtilsProvider>
                          </CCol>
                          <CCol lg="auto">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                              <TimePicker
                                name="recordInTime"
                                value={new Date(record.recordOutTime).getTime() + 18000000}
                                readOnly={true}
                              />
                            </MuiPickersUtilsProvider>
                          </CCol>
                        </CRow>
                      ) : (
                        <p>No existen records dentro de la UMG</p>
                      )
                    })}
                  </CCol>
                  <CCol>
                    <strong>Fecha</strong>
                    <p>
                      {new Date(data.date).getDate() +
                        '/' +
                        (new Date(data.date).getMonth() + 1) +
                        '/' +
                        new Date(data.date).getFullYear()}
                    </p>
                  </CCol>
                </CRow>
              </CCol>
            </CToastBody>
          </CToast>
        </div>
      )
    })

  const changePage = ({ selected }) => {
    setPage(selected)
  }
  const totalPages = Math.ceil(getNames().length / recordsPerPage)

  return (
    <>
      <CRow>
        <div className="toastRecord">
          <CToaster>{displayRecords}</CToaster>
        </div>
      </CRow>
      <CRow>
        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Siguiente'}
          pageCount={totalPages}
          onPageChange={changePage}
          containerClassName={'navigationButtons'}
          previousLinkClassName={'previousButton'}
          nextLinkClassName={'nextButton'}
          disabledClassName={'navigationDisabled'}
          activeClassName={'navigationActive'}
        />
      </CRow>
    </>
  )
}

export default Tables
