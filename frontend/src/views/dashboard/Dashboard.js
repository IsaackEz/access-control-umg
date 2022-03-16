import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import geoJSON from 'src/assets/json/UMG.json'
import axios from 'axios'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { TimePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import esLocale from 'date-fns/locale/es'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CWidgetStatsB,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import student from 'src/assets/images/user/student.png'
import teacher from 'src/assets/images/user/teacher.png'
import guest from 'src/assets/images/user/guest.png'
import foreign from 'src/assets/images/user/foreign.png'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]
  const [onselect, setOnselect] = useState({})
  const [onselect2, setOnselect2] = useState({})
  const [user, setUser] = useState([])
  const [userData, setUserData] = useState([])
  const [records, setRecords] = useState([])
  const [search, setSearch] = useState('')
  const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

  useEffect(() => {
    const loadRec = async () => {
      await axios
        .get('/api/records/lastlocation')
        .then((res) => {
          setUser(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    loadRec()
  }, [])

  useEffect(() => {
    const loadUsers = async () => {
      await axios
        .get('/api/users')
        .then((res) => {
          setUserData(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    loadUsers()
  }, [])

  useEffect(() => {
    const loadRecords = async () => {
      await axios
        .get('/api/records/filter')
        .then((res) => {
          setRecords(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    loadRecords()
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

  const countUsers = () => {
    let countStu = 0
    let countTea = 0
    let countInv = 0
    userData.forEach((userD) => {
      return records.forEach((record) => {
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
    return { countStu, countTea, countInv }
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
                        <CRow>
                          <CCol lg={2}>
                            {console.log(data.userRol)}
                            {data.userRol === 'Alumno' || data.userRol === 'Residente' ? (
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
                                            <MuiPickersUtilsProvider
                                              utils={DateFnsUtils}
                                              locale={esLocale}
                                            >
                                              <CCol lg="auto">
                                                <TimePicker
                                                  name="recordInTime"
                                                  value={new Date(record.records[i].recordInTime)}
                                                  readOnly={true}
                                                />
                                              </CCol>
                                            </MuiPickersUtilsProvider>
                                            {record.records[i].recordOutTime !== null ? (
                                              <MuiPickersUtilsProvider
                                                utils={DateFnsUtils}
                                                locale={esLocale}
                                              >
                                                -
                                                <CCol lg="auto">
                                                  <TimePicker
                                                    id="checkOutTime"
                                                    name="recordOutTime"
                                                    value={
                                                      new Date(record.records[i].recordOutTime)
                                                    }
                                                    readOnly={true}
                                                  />
                                                </CCol>
                                              </MuiPickersUtilsProvider>
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
              <MapContainer center={{ lng: '-103.40838776', lat: '20.63412074' }} zoom={18}>
                <TileLayer
                  url={tileURL}
                  attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
        <CCol className="user-stats" lg={8}>
          <CCard className="mb-4">
            <CCardBody>
              <h5 className="card-title mb-2">Estadistica de usuarios</h5>
              <hr className="mt-0" />
              <CRow>
                <CCol sm={6} lg={4}>
                  <CCardBody>
                    <div className="widget-stats p-2">
                      <CRow>
                        <div className="col-4">
                          <img className="imgUserStat" src={student} alt="" />
                        </div>
                        <div className="col-auto m-2">
                          <h2 className="userTextLabel">{countUsers().countStu}</h2>
                          <p className="labelRol">Alumnos</p>
                        </div>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCol>
                <CCol sm={6} lg={4}>
                  <CCardBody>
                    <div className="widget-stats p-2">
                      <CRow>
                        <div className="col-4">
                          <img className="imgUserStat" src={teacher} alt="" />
                        </div>
                        <div className="col-auto m-2">
                          <h2 className="userTextLabel">{countUsers().countTea}</h2>
                          <p className="labelRol">Maestros</p>
                        </div>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCol>
                <CCol sm={6} lg={4}>
                  <CCardBody>
                    <div className="widget-stats p-2">
                      <CRow>
                        <div className="col-4">
                          <img className="imgUserStat" src={guest} alt="" />
                        </div>
                        <div className="col-auto m-2">
                          <h2 className="userTextLabel">{countUsers().countInv}</h2>
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
          <CCard className="mb-4">
            <CCardBody>
              <h5 className="card-title mb-2">Entradas</h5>
              <hr className="mt-0" />
              <CRow>
                <CCol sm={10}>
                  <p>Puerta Principal</p>
                </CCol>
                <CCol>
                  <span className="nUserLocation">{countInPlaces().countPri}</span>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={10}>
                  <p>C. Montemorelos</p>
                </CCol>
                <CCol>
                  <span className="nUserLocation">{countInPlaces().countMon}</span>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={10}>
                  <p>Residencias</p>
                </CCol>
                <CCol>
                  <span className="nUserLocation">{countInPlaces().countRes}</span>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-medium-emphasis">January - July 2021</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                  fill: true,
                },
                {
                  label: 'My Second dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-success'),
                  pointHoverBackgroundColor: getStyle('--cui-success'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                },
                {
                  label: 'My Third dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: [65, 65, 65, 65, 65, 65, 65],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
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

      <WidgetsBrand withCharts />
      <WidgetsDropdown />

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-medium-emphasis small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Recurring Clients</div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-medium-emphasis small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>

                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-medium-emphasis small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
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
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.usage.value}%</strong>
                          </div>
                          <div className="float-end">
                            <small className="text-medium-emphasis">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">Last login</div>
                        <strong>{item.activity}</strong>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
