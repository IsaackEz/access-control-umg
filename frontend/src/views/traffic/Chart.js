import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import ApexCharts from 'apexcharts'
import axios from 'axios'
import Chart from 'react-apexcharts'

const RTChart = () => {
  const socket = useRef(io.connect(process.env.REACT_APP_IO))
  const [recordsAll, setRecordsAll] = useState([])
  const [userData, setUserData] = useState([])

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

  useEffect(() => {
    loadAllRecords()
    loadUserData()
    socket.current.on('newUser', () => {
      loadAllRecords()
      loadUserData()
    })
  }, [])

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

  const countUsersIn = () => {
    let datesStu = []
    let datesTea = []
    let datesInv = []
    recordsAll.forEach((record) => {
      return userData.forEach((userD) => {
        if (userD.userID === record.userID) {
          if (record.checkOutTime == null) {
            if (userD.userRol === 'Alumno' || userD.userRol === 'Residente') {
              datesStu.push([new Date(record.checkInTime).getTime(), record.usersBefore])
            } else if (userD.userRol === 'Maestro') {
              datesTea.push([new Date(record.checkInTime).getTime(), record.usersBefore])
            } else if (userD.userRol === 'Invitado') {
              datesInv.push([new Date(record.checkInTime).getTime(), record.usersBefore])
            }
          } else {
            if (userD.userRol === 'Alumno' || userD.userRol === 'Residente') {
              datesStu.push([new Date(record.checkInTime).getTime(), record.usersBefore])
              datesStu.push([new Date(record.checkOutTime).getTime(), record.usersAfter])
            } else if (userD.userRol === 'Maestro') {
              datesTea.push([new Date(record.checkInTime).getTime(), record.usersBefore])
              datesTea.push([new Date(record.checkOutTime).getTime(), record.usersAfter])
            } else if (userD.userRol === 'Invitado') {
              datesInv.push([new Date(record.checkInTime).getTime(), record.usersBefore])
              datesInv.push([new Date(record.checkOutTime).getTime(), record.usersAfter])
            }
          }
        }
      })
    })
    datesStu = removeDuplicates(datesStu)
    datesTea = removeDuplicates(datesTea)
    datesInv = removeDuplicates(datesInv)
    return { datesStu, datesTea, datesInv }
  }
  const series = [
    { name: 'Alumnos', data: countUsersIn().datesStu },
    { name: 'Maestros', data: countUsersIn().datesTea },
    { name: 'Invitados', data: countUsersIn().datesInv },
  ]
  const options = {
    chart: { id: 'trafficChart', type: 'line', height: 350 },
    stroke: { curve: 'stepline' },
    colors: ['#008FFB', '#00DF43', '#CF1020'],
    dataLabels: { enabled: false },
    markers: { size: 0, style: 'hollow' },
    xaxis: { type: 'datetime', min: new Date().getTime(), tickAmount: 13 },
    yaxis: { title: { text: 'Usuarios' } },
    tooltip: { x: { format: 'dd MMM yyyy HH:mm:ss' } },
  }

  const seriesRange = [
    { name: 'Alumnos', data: countUsersIn().datesStu },
    { name: 'Maestros', data: countUsersIn().datesTea },
    { name: 'Invitados', data: countUsersIn().datesInv },
  ]

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
    colors: ['#008FFB', '#00DF43', '#CF1020'],
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
    <div>
      <div id="chart">
        <div className="toolbar">
          <button id="one_day" className="btn-range" onClick={() => [updateData('one_day')]}>
            1D
          </button>
          &nbsp;
          <button id="one_week" className="btn-range" onClick={() => [updateData('one_week')]}>
            1S
          </button>
          &nbsp;
          <button id="one_month" className="btn-range" onClick={() => [updateData('one_month')]}>
            1M
          </button>
          &nbsp;
          <button id="six_months" className="btn-range" onClick={() => [updateData('six_months')]}>
            6M
          </button>
          &nbsp;
          <button id="all" className="btn-range" onClick={() => [updateData('all')]}>
            Todo
          </button>
        </div>

        <div id="chart-timeline">
          <Chart options={options} series={series} type="line" height={350} />
        </div>
        <div id="chart-line">
          <Chart options={optionsRange} series={seriesRange} type="area" height={200} />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  )
}

export default RTChart
