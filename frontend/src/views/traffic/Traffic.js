import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import RTChart from './Chart'
import geoJSON from '../../geojson'
import { io } from 'socket.io-client'

import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CProgressBar,
  CRow,
} from '@coreui/react'

const Traffic = () => {
  const [records, setRecords] = useState([])
  const [recordsAll, setRecordsAll] = useState([])
  const [userData, setUserData] = useState([])
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

  const loadRecords = async () => {
    await axios
      .get('https://api.cinic.xyz/api/records/filter')
      .then((res) => {
        setRecords(res.data)
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
    loadRecords()
    loadUserData()
    loadAllRecords()
    socket.current.on('newUser', () => {
      loadRecords()
      loadUserData()
      loadAllRecords()
    })
  }, [])

  const countUsersIn = () => {
    let countStu = 0
    let countTea = 0
    let countInv = 0
    userData.forEach((userD) => {
      return recordsAll.forEach((record) => {
        if (
          userD.userID === record.userID &&
          (userD.userRol === 'Alumno' || userD.userRol === 'Residente')
        ) {
          countStu++
        } else if (userD.userID === record.userID && userD.userRol === 'Maestro') {
          countTea++
        } else if (userD.userID === record.userID && userD.userRol === 'Invitado') {
          countInv++
        }
      })
    })
    const totalUsers = countStu + countTea + countInv
    return { countStu, countTea, countInv, totalUsers }
  }

  const countUsersPercent = () => {
    const stdPercent = (countUsersIn().countStu / countUsersIn().totalUsers) * 100
    const teaPercent = (countUsersIn().countTea / countUsersIn().totalUsers) * 100
    const invPercent = (countUsersIn().countInv / countUsersIn().totalUsers) * 100
    return { stdPercent, teaPercent, invPercent }
  }

  const progressExample = [
    {
      title: 'Alumnos',
      value: countUsersIn().countStu,
      percent: Math.floor(countUsersPercent().stdPercent),
      color: 'info',
    },
    {
      title: 'Maestros',
      value: countUsersIn().countTea,
      percent: Math.floor(countUsersPercent().teaPercent),
      color: 'success',
    },
    {
      title: 'Invitados',
      value: countUsersIn().countInv,
      percent: Math.floor(countUsersPercent().invPercent),
      color: 'danger',
    },
  ]
  const getColorPlace = (place) => {
    let colorPlace
    if (place === 'Salon 304') {
      colorPlace = 'primary'
    } else if (place === 'Residencias') {
      colorPlace = 'success'
    } else if (place === 'Salon 203') {
      colorPlace = 'danger'
    } else if (place === 'Salon 113') {
      colorPlace = 'info'
    }

    return colorPlace
  }
  const getPlacePercent = (place) => {
    let countPlace = 0
    let percentPlace = 0
    recordsAll.forEach((record) => {
      record.records.forEach((recIn) => {
        if (record.checkInPlace === place || recIn.recordInPlace === place) {
          countPlace++
        }
      })
    })
    percentPlace = (countPlace / recordsAll.length) * 100
    return { countPlace, percentPlace }
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Trafico
              </h4>
            </CCol>
          </CRow>
          <RTChart />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value} ({item.percent}%)
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <CRow>
        <CCard className="mb-4">
          <CCardHeader>Flujo de Accesos</CCardHeader>
          <CCardBody>
            {geoJSON.features.map((list, key) => {
              return (
                <div className="userItem mb-3" key={key}>
                  <div className="userItemLoc mt-3">
                    <CRow>
                      <CCol lg={1}>
                        <p>{getPlacePercent(list.properties.name).countPlace}</p>
                      </CCol>
                      <CCol>
                        <p>{list.properties.name}</p>
                      </CCol>
                      <CCol lg="auto">
                        <p>{getPlacePercent(list.properties.name).percentPlace}%</p>
                      </CCol>
                    </CRow>

                    <CProgress height={10} className="mb-1">
                      <CProgressBar
                        color={getColorPlace(list.properties.name)}
                        value={getPlacePercent(list.properties.name).percentPlace}
                      ></CProgressBar>
                    </CProgress>
                  </div>
                </div>
              )
            })}
          </CCardBody>
        </CCard>
      </CRow>
    </>
  )
}

export default Traffic
