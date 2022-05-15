import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import geoJSON from '../../geojson'
import { io } from 'socket.io-client'
import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts'

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
  const [onselect, setOnselect] = useState([])
  const [user, setUser] = useState([])
  const socket = useRef(io.connect(process.env.REACT_APP_IO))
  const loadUsers = async () => {
    await axios
      .get('https://api.cinic.xyz/api/records/lastlocation')
      .then((res) => {
        setUser(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
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
    loadUsers()
    socket.current.on('newUser', () => {
      loadRecords()
      loadUserData()
      loadAllRecords()
      loadUsers()
    })
  }, [])

  const countUsersInBar = () => {
    let countStu = 0
    let countRes = 0
    let countTea = 0
    let countInv = 0
    userData.forEach((userD) => {
      return recordsAll.forEach((record) => {
        if (userD.userID === record.userID) {
          if (userD.userRol === 'Alumno') {
            countStu++
          } else if (userD.userRol === 'Residente') {
            countRes++
          } else if (userD.userRol === 'Maestro') {
            countTea++
          } else if (userD.userRol === 'Invitado') {
            countInv++
          }
        }
      })
    })
    const totalUsers = countStu + countTea + countInv + countRes
    return { countStu, countTea, countInv, totalUsers, countRes }
  }

  const countUsersPercent = () => {
    const stdPercent = (countUsersInBar().countStu / countUsersInBar().totalUsers) * 100
    const resPercent = (countUsersInBar().countRes / countUsersInBar().totalUsers) * 100
    const teaPercent = (countUsersInBar().countTea / countUsersInBar().totalUsers) * 100
    const invPercent = (countUsersInBar().countInv / countUsersInBar().totalUsers) * 100
    return { stdPercent, resPercent, teaPercent, invPercent }
  }

  const progressExample = [
    {
      title: 'Alumnos',
      value: countUsersInBar().countStu,
      percent: Math.floor(countUsersPercent().stdPercent),
      color: 'info',
    },
    {
      title: 'Residentes',
      value: countUsersInBar().countRes,
      percent: Math.floor(countUsersPercent().resPercent),
      color: 'warning',
    },
    {
      title: 'Maestros',
      value: countUsersInBar().countTea,
      percent: Math.floor(countUsersPercent().teaPercent),
      color: 'success',
    },
    {
      title: 'Invitados',
      value: countUsersInBar().countInv,
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

  //Chart data
  const removeDuplicates = (arr) => {
    var unique = []
    arr.forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element)
      }
    })
    unique.sort()
    return unique
  }

  const countAllUsersInOut = (place) => {
    console.log(place)
    let datesStu = []
    let datesRes = []
    let datesTea = []
    let datesInv = []
    recordsAll.forEach((record) => {
      return userData.forEach((userD) => {
        if (userD.userID === record.userID) {
          if (
            place === 'Residencias' ||
            place === 'Puerta Principal' ||
            place === 'C. Montemorelos'
          ) {
            if (record.checkOutTime == null) {
              if (userD.userRol === 'Alumno') {
                datesStu.push([new Date(record.checkInTime).getTime(), record.usersBefore])
              } else if (userD.userRol === 'Residente') {
                datesRes.push([new Date(record.checkInTime).getTime(), record.usersBefore])
              } else if (userD.userRol === 'Maestro') {
                datesTea.push([new Date(record.checkInTime).getTime(), record.usersBefore])
              } else if (userD.userRol === 'Invitado') {
                datesInv.push([new Date(record.checkInTime).getTime(), record.usersBefore])
              }
            } else {
              if (userD.userRol === 'Alumno') {
                datesStu.push([new Date(record.checkInTime).getTime(), record.usersBefore])
                datesStu.push([new Date(record.checkOutTime).getTime(), record.usersAfter])
              } else if (userD.userRol === 'Residente') {
                datesRes.push([new Date(record.checkInTime).getTime(), record.usersBefore])
                datesRes.push([new Date(record.checkOutTime).getTime(), record.usersAfter])
              } else if (userD.userRol === 'Maestro') {
                datesTea.push([new Date(record.checkInTime).getTime(), record.usersBefore])
                datesTea.push([new Date(record.checkOutTime).getTime(), record.usersAfter])
              } else if (userD.userRol === 'Invitado') {
                datesInv.push([new Date(record.checkInTime).getTime(), record.usersBefore])
                datesInv.push([new Date(record.checkOutTime).getTime(), record.usersAfter])
              }
            }
          } else {
            record.records.forEach((recordsIn) => {
              if (recordsIn.recordOutTime == null && recordsIn.recordInTime != null) {
                if (userD.userRol === 'Alumno') {
                  datesStu.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                } else if (userD.userRol === 'Residente') {
                  datesRes.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                } else if (userD.userRol === 'Maestro') {
                  datesTea.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                } else if (userD.userRol === 'Invitado') {
                  datesInv.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                }
              } else if (recordsIn.recordOutTime != null) {
                if (userD.userRol === 'Alumno') {
                  datesStu.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                  datesStu.push([new Date(recordsIn.recordOutTime).getTime(), recordsIn.usersAfter])
                } else if (userD.userRol === 'Residente') {
                  datesRes.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                  console.log(datesRes)
                  datesRes.push([new Date(recordsIn.recordOutTime).getTime(), recordsIn.usersAfter])
                } else if (userD.userRol === 'Maestro') {
                  datesTea.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                  datesTea.push([new Date(recordsIn.recordOutTime).getTime(), recordsIn.usersAfter])
                } else if (userD.userRol === 'Invitado') {
                  datesInv.push([new Date(recordsIn.recordInTime).getTime(), recordsIn.usersBefore])
                  datesInv.push([new Date(recordsIn.recordOutTime).getTime(), recordsIn.usersAfter])
                }
              }
            })
          }
        }
      })
    })

    datesStu = removeDuplicates(datesStu)
    datesRes = removeDuplicates(datesRes)
    datesTea = removeDuplicates(datesTea)
    datesInv = removeDuplicates(datesInv)
    return { datesStu, datesRes, datesTea, datesInv }
  }
  const seriesChart = (place) => {
    const series = [
      { name: 'Alumnos', data: countAllUsersInOut(place).datesStu },
      { name: 'Residentes', data: countAllUsersInOut(place).datesRes },
      { name: 'Maestros', data: countAllUsersInOut(place).datesTea },
      { name: 'Invitados', data: countAllUsersInOut(place).datesInv },
    ]
    return series
  }

  const options = {
    chart: { id: 'trafficChart', type: 'line', height: 350 },
    stroke: { curve: 'stepline' },
    colors: ['#008FFB', '#ffa500', '#00DF43', '#CF1020'],
    dataLabels: { enabled: false },
    markers: { size: 0, style: 'hollow' },
    xaxis: { type: 'datetime', min: new Date().getTime(), tickAmount: 13 },
    yaxis: { title: { text: 'Usuarios' } },
    tooltip: { x: { format: 'dd MMM yyyy HH:mm:ss' } },
  }
  const seriesRangeChart = (place) => {
    const seriesRange = [
      { name: 'Alumnos', data: countAllUsersInOut(place).datesStu },
      { name: 'Residentes', data: countAllUsersInOut(place).datesRes },
      { name: 'Maestros', data: countAllUsersInOut(place).datesTea },
      { name: 'Invitados', data: countAllUsersInOut(place).datesInv },
    ]
    return seriesRange
  }

  const optionsRange = {
    chart: {
      id: 'rangeChart',
      height: 130,
      type: 'line',
      brush: { target: 'trafficChart', enabled: true },
      selection: {
        enabled: true,
        xaxis: { min: new Date().getTime() - 86400000, max: new Date().getTime() },
      },
    },
    stroke: { curve: 'stepline' },
    colors: ['#008FFB', '#ffa500', '#00DF43', '#CF1020'],
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.91, opacityTo: 0.1 },
    },
    xaxis: { type: 'datetime', tooltip: { enabled: false } },
    yaxis: { tickAmount: 6 },
  }

  const updateData = (timeline) => {
    switch (timeline) {
      case 'one_day':
        ApexCharts.exec(
          'trafficChart',
          'zoomX',
          new Date().getTime() - 86400000,
          new Date().getTime(),
        )
        break
      case 'one_week':
        ApexCharts.exec(
          'trafficChart',
          'zoomX',
          new Date().getTime() - 604800016.56,
          new Date().getTime(),
        )
        break
      case 'one_month':
        ApexCharts.exec(
          'trafficChart',
          'zoomX',
          new Date().getTime() - 2629800000,
          new Date().getTime(),
        )
        break
      case 'six_months':
        ApexCharts.exec(
          'trafficChart',
          'zoomX',
          new Date().getTime() - 15778800000,
          new Date().getTime(),
        )
        break
      case 'all':
        ApexCharts.exec(
          'trafficChart',
          'zoomX',
          new Date('01 Jan 2020').getTime(),
          new Date().getTime(),
        )
        break
      default:
    }
  }

  return (
    <>
      <CCard className="mb-4">
        {onselect.name && (
          <>
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Trafico en{' '}
                    {onselect.name === 'Residencias' || 'Puerta Principal' || 'C. Montemorelos'
                      ? 'UMG'
                      : onselect.name}
                  </h4>
                </CCol>
              </CRow>
              <div>
                <div id="chart">
                  <div className="toolbar">
                    <button
                      id="one_day"
                      className="btn-range"
                      onClick={() => [updateData('one_day')]}
                    >
                      1D
                    </button>
                    &nbsp;
                    <button
                      id="one_week"
                      className="btn-range"
                      onClick={() => [updateData('one_week')]}
                    >
                      1S
                    </button>
                    &nbsp;
                    <button
                      id="one_month"
                      className="btn-range"
                      onClick={() => [updateData('one_month')]}
                    >
                      1M
                    </button>
                    &nbsp;
                    <button
                      id="six_months"
                      className="btn-range"
                      onClick={() => [updateData('six_months')]}
                    >
                      6M
                    </button>
                    &nbsp;
                    <button id="all" className="btn-range" onClick={() => [updateData('all')]}>
                      Todo
                    </button>
                  </div>

                  <div id="chart-timeline">
                    <Chart
                      options={options}
                      series={seriesChart(onselect.name)}
                      type="line"
                      height={350}
                    />
                  </div>
                  <div id="chart-line">
                    <Chart
                      options={optionsRange}
                      series={seriesRangeChart(onselect.name)}
                      type="area"
                      height={200}
                    />
                  </div>
                </div>
                <div id="html-dist"></div>
              </div>
            </CCardBody>
            <CCardFooter>
              <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
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
          </>
        )}
      </CCard>
      <CRow>
        <CCard className="mb-4">
          <CCardHeader>Flujo de Accesos</CCardHeader>
          <CCardBody>
            {geoJSON.features.map((list, key) => {
              return (
                <div
                  className="userItem mb-3"
                  key={key}
                  onClick={() => {
                    setOnselect({ name: list.properties.name })
                  }}
                >
                  <div className="userItemLoc mt-3">
                    <CRow>
                      <CCol lg={1}>
                        <p>{getPlacePercent(list.properties.name).countPlace}</p>
                      </CCol>
                      <CCol>
                        <p>{list.properties.name}</p>
                      </CCol>
                      <CCol lg="auto">
                        <p>{Math.floor(getPlacePercent(list.properties.name).percentPlace)}%</p>
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
