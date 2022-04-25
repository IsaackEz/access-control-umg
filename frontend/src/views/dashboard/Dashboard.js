import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { TimePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import esLocale from 'date-fns/locale/es'
import geoJSON from '../../geojson'
import DataTable from 'react-data-table-component'

import { io } from 'socket.io-client'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CProgress,
  CProgressBar,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'

import student from 'src/assets/images/user/student.png'
import teacher from 'src/assets/images/user/teacher.png'
import guest from 'src/assets/images/user/guest.png'
import foreign from 'src/assets/images/user/foreign.png'

const Dashboard = () => {
  const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

  const [onselect, setOnselect] = useState({})
  const [onselect2, setOnselect2] = useState({})
  const [user, setUser] = useState([])
  const [userData, setUserData] = useState([])
  const [records, setRecords] = useState([])
  const [recordsAll, setRecordsAll] = useState([])
  const [search, setSearch] = useState('')
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
    loadAllRecords()
    loadRecords()
    loadUsers()
    loadUserData()
    socket.current.on('newUser', () => {
      loadAllRecords()
      loadRecords()
      loadUsers()
      loadUserData()
    })
  }, [])

  const highlightFeature = (e) => {
    const { name } = e.target.feature.properties
    setOnselect({
      name: name,
    })
  }

  const onEachLocation = (location, layer) => {
    layer.on({
      click: highlightFeature,
    })
  }

  const getOpacity = (feature) => {
    const locationType = feature.type

    return locationType === 'Institucion' ? '0.3' : '1'
  }

  const getColor = (feature) => {
    const locationType = feature.type

    return locationType === 'Entrada/Salida'
      ? 'red'
      : locationType === 'Ingenierias'
      ? 'green'
      : locationType === 'Deportes'
      ? 'yellow'
      : locationType === 'Salon'
      ? 'orange'
      : locationType === 'Institucion'
      ? 'blue'
      : locationType === 'Administrativo'
      ? 'purple'
      : 'pink'
  }

  const featureStyle = (e) => {
    return {
      fillColor: getColor(e.properties),
      fillOpacity: getOpacity(e.properties),
    }
  }

  const getCount = (place) => {
    let count = 0
    user.forEach((userR) => {
      if (userR.records.recordInPlace === place && userR.records.recordOutTime === null) {
        count++
      } else if (
        place === 'UMG' &&
        (userR.records.recordOutTime !== null || userR.records.recordInPlace === '')
      ) {
        count++
      }
    })

    return count
  }

  const countAllUsers = () => {
    let countStu = 0
    let countTea = 0
    userData.forEach((userD) => {
      if (userD.userRol === 'Alumno' || userD.userRol === 'Residente') {
        countStu++
      } else if (userD.userRol === 'Maestro') {
        countTea++
      }
    })
    return { countStu, countTea }
  }

  const countUsersIn = () => {
    let countStu = 0
    let countTea = 0
    let countInv = 0
    let countRes = 0
    userData.forEach((userD) => {
      return records.forEach((record) => {
        if (userD.userID === record.userID && userD.userRol === 'Alumno') {
          countStu++
        } else if (userD.userID === record.userID && userD.userRol === 'Maestro') {
          countTea++
        } else if (userD.userID === record.userID && userD.userRol === 'Invitado') {
          countInv++
        } else if (userD.userID === record.userID && userD.userRol === 'Residente') {
          countRes++
        }
      })
    })
    return { countStu, countTea, countInv, countRes }
  }

  const countInPlaces = () => {
    let countPri = 0
    let countRes = 0
    let countMon = 0
    records.forEach((record) => {
      if (record.checkInPlace === 'C. Montemorelos') {
        countMon++
      } else if (record.checkInPlace === 'Puerta Principal') {
        countPri++
      } else if (record.checkInPlace === 'Residencias') {
        countRes++
      }
    })
    return { countPri, countRes, countMon }
  }

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: 'Usuario',
      selector: (row) => row.userID,
      sortable: true,
    },
    {
      name: 'Rol',
      selector: (row) => row.userRol,
      sortable: true,
    },
    {
      name: 'Lugar de entrada',
      selector: (row) => row.checkInPlace,
      sortable: true,
    },
    {
      name: 'Hora de entrada',
      selector: (row) => row.checkInTime,
      sortable: true,
    },
    {
      name: 'Lugar de salida',
      selector: (row) => row.checkOutPlace,
      sortable: true,
    },
    {
      name: 'Hora de salida',
      selector: (row) => row.checkOutTime,
      sortable: true,
    },
  ]

  const getNames = () => {
    let fullRecords = JSON.parse(JSON.stringify(recordsAll))
    userData.forEach((names) => {
      fullRecords.forEach((record) => {
        if (names.userID === record.userID) {
          record['fullName'] = names.name + ' ' + names.lastname
          record['userRol'] = names.userRol
          record['checkInTime'] = tConvert(record.checkInTime.slice(11, 19))
          if (record.checkOutTime != null) {
            record['checkOutTime'] = tConvert(record.checkOutTime.slice(11, 19))
          }
        }
      })
    })
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

  const countPlacePercent = () => {
    const priIn = (countInPlaces().countPri / records.length) * 100
    const resIn = (countInPlaces().countRes / records.length) * 100
    const monIn = (countInPlaces().countMon / records.length) * 100
    return { priIn, resIn, monIn }
  }

  const getDayName = () => {
    let countMondaySt = 0
    let countTuesdaySt = 0
    let countWednesdaySt = 0
    let countThursdaySt = 0
    let countFridaySt = 0
    let countSaturdaySt = 0
    let countSundaySt = 0

    let countMondayTea = 0
    let countTuesdayTea = 0
    let countWednesdayTea = 0
    let countThursdayTea = 0
    let countFridayTea = 0
    let countSaturdayTea = 0
    let countSundayTea = 0
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    recordsAll.forEach((record) => {
      userData.forEach((userD) => {
        if (userD.userID === record.userID) {
          if (userD.userRol === 'Residente' || userD.userRol === 'Alumno') {
            let d = new Date(record.checkInTime)
            if (weekday[d.getDay()] === 'Monday') {
              countMondaySt++
            } else if (weekday[d.getDay()] === 'Tuesday') {
              countTuesdaySt++
            } else if (weekday[d.getDay()] === 'Wednesday') {
              countWednesdaySt++
            } else if (weekday[d.getDay()] === 'Thursday') {
              countThursdaySt++
            } else if (weekday[d.getDay()] === 'Friday') {
              countFridaySt++
            } else if (weekday[d.getDay()] === 'Saturday') {
              countSaturdaySt++
            } else if (weekday[d.getDay()] === 'Sunday') {
              countSundaySt++
            }
          } else if (userD.userRol === 'Maestro') {
            let d = new Date(record.checkInTime)
            if (weekday[d.getDay()] === 'Monday') {
              countMondayTea++
            } else if (weekday[d.getDay()] === 'Tuesday') {
              countTuesdayTea++
            } else if (weekday[d.getDay()] === 'Wednesday') {
              countWednesdayTea++
            } else if (weekday[d.getDay()] === 'Thursday') {
              countThursdayTea++
            } else if (weekday[d.getDay()] === 'Friday') {
              countFridayTea++
            } else if (weekday[d.getDay()] === 'Saturday') {
              countSaturdayTea++
            } else if (weekday[d.getDay()] === 'Sunday') {
              countSundayTea++
            }
          }
        }
      })
    })

    const percentMondaySt = (countMondaySt / recordsAll.length) * 100
    const percentTuesdaySt = (countTuesdaySt / recordsAll.length) * 100
    const percentWednesdaySt = (countWednesdaySt / recordsAll.length) * 100
    const percentThursdaySt = (countThursdaySt / recordsAll.length) * 100
    const percentFridaySt = (countFridaySt / recordsAll.length) * 100
    const percentSaturdaySt = (countSaturdaySt / recordsAll.length) * 100
    const percentSundaySt = (countSundaySt / recordsAll.length) * 100

    const percentMondayTea = (countMondayTea / recordsAll.length) * 100
    const percentTuesdayTea = (countTuesdayTea / recordsAll.length) * 100
    const percentWednesdayTea = (countWednesdayTea / recordsAll.length) * 100
    const percentThursdayTea = (countThursdayTea / recordsAll.length) * 100
    const percentFridayTea = (countFridayTea / recordsAll.length) * 100
    const percentSaturdayTea = (countSaturdayTea / recordsAll.length) * 100
    const percentSundayTea = (countSundayTea / recordsAll.length) * 100

    return {
      percentMondaySt,
      percentTuesdaySt,
      percentWednesdaySt,
      percentThursdaySt,
      percentFridaySt,
      percentSaturdaySt,
      percentSundaySt,

      percentMondayTea,
      percentTuesdayTea,
      percentWednesdayTea,
      percentThursdayTea,
      percentFridayTea,
      percentSaturdayTea,
      percentSundayTea,
    }
  }
  return (
    <>
      <CCard className="mb-2">
        <CCardBody>
          <h5 className="card-title mb-2">Mapa</h5>
          <hr className="mt-0" />
          <CRow>
            <CCol lg={10}>
              {onselect.name && (
                <div className="locationInfo">
                  <div className="locationHeader">
                    <div className="locationName">
                      <strong>{onselect.name}</strong>
                      <hr className="mt-0 mt-2" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control searchUser"
                      maxLength="10"
                      minLength="4"
                      onChange={(e) => {
                        setSearch(e.target.value)
                      }}
                    />
                  </div>
                  {user
                    .filter((val) => {
                      if (
                        search === '' ||
                        val.userID.toLowerCase().includes(search.toLowerCase())
                      ) {
                        return val
                      } else {
                        return null
                      }
                    })
                    .map((item) =>
                      item.records.recordInPlace === onselect.name &&
                      (item.records.recordOutTime === null ||
                        item.records.recordOutPlace === '') ? (
                        <div
                          className="locationUsers"
                          onClick={() => {
                            setOnselect2({ name: item.userID })
                          }}
                        >
                          {item.userID}
                        </div>
                      ) : onselect.name === 'UMG' &&
                        (item.records.recordOutTime !== null ||
                          item.records.recordInPlace === '') ? (
                        <div
                          className="locationUsers"
                          onClick={() => {
                            setOnselect2({ name: item.userID })
                          }}
                        >
                          {item.userID}
                        </div>
                      ) : (
                        <></>
                      ),
                    )}
                </div>
              )}
              {onselect2.name && (
                <div className="userInfo">
                  {userData.map((data) => {
                    return onselect2.name === data.userID ? (
                      <div className="userDetails">
                        <div className="titleCloseBtn">
                          <button
                            onClick={() => {
                              setOnselect2({})
                            }}
                          >
                            X
                          </button>
                        </div>
                        <CRow>
                          <CCol lg={2}>
                            {data.userRol === 'Alumno' ? (
                              <img className="imgUser" src={student} alt="" />
                            ) : data.userRol === 'Maestro' ? (
                              <img className="imgUser" src={teacher} alt="" />
                            ) : data.userRol === 'Residente' ? (
                              <img className="imgUser" src={foreign} alt="" />
                            ) : data.userRol === 'Invitado' ? (
                              <img className="imgUser" src={guest} alt="" />
                            ) : (
                              <></>
                            )}
                          </CCol>
                          <CCol lg="auto">
                            <div className="userName ms-2">
                              <p>
                                <strong>{data.userID}</strong>
                                {data.covid === true ? (
                                  <span className="statusIna"></span>
                                ) : (
                                  <span className="statusAct"></span>
                                )}
                              </p>
                              <p>
                                {data.name} {data.lastname}
                              </p>
                              <p>{data.email.toLowerCase()}</p>
                            </div>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <div className="allRecords">
                              {records.map((record, index) => {
                                return record.userID === data.userID ? (
                                  <div className="records" key={index}>
                                    <strong>Entrada</strong>
                                    <CRow>
                                      <CCol lg={4}>
                                        <p>{record.checkInPlace}</p>
                                      </CCol>
                                      <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                        locale={esLocale}
                                      >
                                        <CCol lg="auto">
                                          <TimePicker
                                            className="dateCheckIn"
                                            name="checkInTime"
                                            value={new Date(record.checkInTime)}
                                            views="year"
                                            readOnly={true}
                                          />
                                        </CCol>
                                      </MuiPickersUtilsProvider>
                                    </CRow>
                                    <strong>Historial</strong>
                                    {record.records.map((item, i) => {
                                      return record.records[i].recordInPlace !== '' ? (
                                        item.recordInPlace !== null ? (
                                          <CRow>
                                            <CCol lg={4}>
                                              <p>{record.records[i].recordInPlace}</p>
                                            </CCol>
                                            <CCol lg="auto">
                                              <MuiPickersUtilsProvider
                                                utils={DateFnsUtils}
                                                locale={esLocale}
                                              >
                                                <TimePicker
                                                  name="recordInTime"
                                                  value={new Date(record.records[i].recordInTime)}
                                                  readOnly={true}
                                                />
                                              </MuiPickersUtilsProvider>
                                            </CCol>

                                            {record.records[i].recordOutTime !== null ? (
                                              <CCol lg="auto">
                                                <MuiPickersUtilsProvider
                                                  utils={DateFnsUtils}
                                                  locale={esLocale}
                                                >
                                                  <TimePicker
                                                    id="checkOutTime"
                                                    name="recordOutTime"
                                                    value={
                                                      new Date(record.records[i].recordOutTime)
                                                    }
                                                    readOnly={true}
                                                  />
                                                </MuiPickersUtilsProvider>
                                              </CCol>
                                            ) : (
                                              <></>
                                            )}
                                          </CRow>
                                        ) : (
                                          <></>
                                        )
                                      ) : (
                                        <h6>No hay historial</h6>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <></>
                                )
                              })}
                            </div>
                          </CCol>
                        </CRow>
                      </div>
                    ) : (
                      <></>
                    )
                  })}
                </div>
              )}
              <MapContainer
                center={{ lng: '-103.40838776', lat: '20.63412074' }}
                zoom={18}
                scrollWheelZoom={false}
                gestureHandling={true}
              >
                <TileLayer
                  url={tileURL}
                  attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON style={featureStyle} data={geoJSON} onEachFeature={onEachLocation} />
              </MapContainer>
            </CCol>

            <CCol lg={2}>
              <CCard className="userList mb-2">
                <CCardBody>
                  <div className="userText">
                    <h2 className="nUsers">
                      <strong>{records.length}</strong>
                    </h2>{' '}
                    <p className="userTextLabel">Usuarios</p>
                  </div>
                  {geoJSON.features.map((list, key) => {
                    return (
                      <div
                        className="userItem mb-3"
                        key={key}
                        onClick={() => {
                          setOnselect({ name: list.properties.name })
                        }}
                      >
                        {list.properties.type === 'Entrada/Salida' ? (
                          <></>
                        ) : (
                          <div className="userItemLoc mt-3">
                            {list.properties.name}
                            <span className="nUserLocation float-end">
                              {getCount(list.properties.name)}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CRow>
        <CCol className="user-stats" lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h5 className="card-title mb-2">Estadistica de usuarios</h5>
              <hr className="mt-0" />
              <CRow>
                <CCol lg={6}>
                  <CCardBody>
                    <div className="widget-stats p-1">
                      <CRow>
                        <div className="col-4">
                          <img className="imgUserStat" src={student} alt="" />
                        </div>
                        <div className="col-auto m-2">
                          <h2 className="userTextLabel">{countUsersIn().countStu}</h2>
                          <p className="labelRol">Alumnos</p>
                        </div>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCol>
                <CCol lg={6}>
                  <CCardBody>
                    <div className="widget-stats p-2">
                      <CRow>
                        <div className="col-4">
                          <img className="imgUserStat" src={foreign} alt="" />
                        </div>
                        <div className="col-auto m-2">
                          <h2 className="userTextLabel">{countUsersIn().countRes}</h2>
                          <p className="labelRol">Residente</p>
                        </div>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCol>
              </CRow>
              <CRow>
                <CCol lg={6}>
                  <CCardBody>
                    <div className="widget-stats p-2">
                      <CRow>
                        <div className="col-4">
                          <img className="imgUserStat" src={teacher} alt="" />
                        </div>
                        <div className="col-auto m-2">
                          <h2 className="userTextLabel">{countUsersIn().countTea}</h2>
                          <p className="labelRol">Maestros</p>
                        </div>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCol>
                <CCol lg={6}>
                  <CCardBody>
                    <div className="widget-stats p-2">
                      <CRow>
                        <div className="col-4">
                          <img className="imgUserStat" src={guest} alt="" />
                        </div>
                        <div className="col-auto m-2">
                          <h2 className="userTextLabel">{countUsersIn().countInv}</h2>
                          <p className="labelRol">Invitados</p>
                        </div>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol className="in-out" lg={4}>
          <CCard>
            <CCardBody>
              <h5 className="card-title mb-2">Entradas</h5>
              <hr className="mt-0" />
              <CRow>
                <CCol>
                  <p>Puerta Principal</p>
                </CCol>
                <CCol lg="auto">
                  <span className="nUserLocation">{countInPlaces().countPri}</span>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <p>C. Montemorelos</p>
                </CCol>
                <CCol lg="auto">
                  <span className="nUserLocation">{countInPlaces().countMon}</span>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <p>Residencias</p>
                </CCol>
                <CCol lg="auto">
                  <span className="nUserLocation">{countInPlaces().countRes}</span>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className=" mb-4">
        <CCardBody>
          <h5 className="card-title mb-2">Historial</h5>
          <hr className="mt-0" />
          <div className="containerTable">
            <DataTable columns={columns} data={getNames()} pagination responsive />
          </div>
        </CCardBody>
      </CCard>

      <CRow>
        <CCol lg={8}>
          <CCard className="mb-4">
            <CCardHeader>Trafico</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol lg={18}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-primary py-1 px-3">
                        <div className="text-medium-emphasis small">Alumnos</div>
                        <div className="fs-5 fw-semibold">{countAllUsers().countStu}</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Maestros</div>
                        <div className="fs-5 fw-semibold">{countAllUsers().countTea}</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  <p>Lunes</p>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar value={Math.floor(getDayName().percentMondaySt)}></CProgressBar>
                  </CProgress>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      color="success"
                      value={Math.floor(getDayName().percentMondayTea)}
                    ></CProgressBar>
                  </CProgress>
                  <p>Martes</p>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar value={Math.floor(getDayName().percentTuesdaySt)}></CProgressBar>
                  </CProgress>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      color="success"
                      value={Math.floor(getDayName().percentTuesdayTea)}
                    ></CProgressBar>
                  </CProgress>
                  <p>Miercoles</p>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      value={Math.floor(getDayName().percentWednesdaySt)}
                    ></CProgressBar>
                  </CProgress>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      color="success"
                      value={Math.floor(getDayName().percentWednesdayTea)}
                    ></CProgressBar>
                  </CProgress>
                  <p>Jueves</p>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar value={Math.floor(getDayName().percentThursdaySt)}></CProgressBar>
                  </CProgress>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      color="success"
                      value={Math.floor(getDayName().percentThursdayTea)}
                    ></CProgressBar>
                  </CProgress>
                  <p>Viernes</p>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar value={Math.floor(getDayName().percentFridaySt)}></CProgressBar>
                  </CProgress>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      color="success"
                      value={Math.floor(getDayName().percentFridayTea)}
                    ></CProgressBar>
                  </CProgress>
                  <p>Sabado</p>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar value={Math.floor(getDayName().percentSaturdaySt)}></CProgressBar>
                  </CProgress>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      color="success"
                      value={Math.floor(getDayName().percentSaturdayTea)}
                    ></CProgressBar>
                  </CProgress>
                  <p>Domingo</p>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar value={Math.floor(getDayName().percentSundaySt)}></CProgressBar>
                  </CProgress>
                  <CProgress height={3} className="mb-1">
                    <CProgressBar
                      color="success"
                      value={Math.floor(getDayName().percentSundayTea)}
                    ></CProgressBar>
                  </CProgress>
                </CCol>
              </CRow>

              <br />

              {/* <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Country</CTableHeaderCell>
                    <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody></CTableBody>
              </CTable> */}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Estadistica</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol lg={18}>
                  <CRow>
                    <CCol>
                      <p>Hombres</p>
                    </CCol>
                    <CCol lg="auto">
                      <p>{Math.floor(countPlacePercent().priIn)}%</p>
                    </CCol>
                  </CRow>
                  <CProgress height={8} className="mb-5">
                    <CProgressBar value={25}></CProgressBar>
                  </CProgress>

                  <CRow>
                    <CCol>
                      <p>Mujeres</p>
                    </CCol>
                    <CCol lg="auto">
                      <p>{Math.floor(countPlacePercent().priIn)}%</p>
                    </CCol>
                  </CRow>
                  <CProgress height={8} className="mb-5">
                    <CProgressBar color="danger" value={25}></CProgressBar>
                  </CProgress>

                  <hr className="mt-0" />

                  <CRow>
                    <CCol>
                      <p>Entrada Principal</p>
                    </CCol>
                    <CCol lg="auto">
                      <p>{Math.floor(countPlacePercent().priIn)}%</p>
                    </CCol>
                  </CRow>
                  <CProgress height={7} className="mb-5">
                    <CProgressBar color="info" value={countPlacePercent().priIn}></CProgressBar>
                  </CProgress>

                  <CRow>
                    <CCol>
                      <p>Residencias</p>
                    </CCol>
                    <CCol lg="auto">
                      <p>{Math.floor(countPlacePercent().resIn)}%</p>
                    </CCol>
                  </CRow>
                  <CProgress height={7} className="mb-5">
                    <CProgressBar color="success" value={countPlacePercent().resIn}></CProgressBar>
                  </CProgress>

                  <CRow>
                    <CCol>
                      <p>C. Montemorelos</p>
                    </CCol>
                    <CCol lg="auto">
                      <p>{Math.floor(countPlacePercent().monIn)}%</p>
                    </CCol>
                  </CRow>
                  <CProgress height={7} className="mb-5">
                    <CProgressBar color="warning" value={countPlacePercent().monIn}></CProgressBar>
                  </CProgress>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
