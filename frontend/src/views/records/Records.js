import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { CCard, CCardBody, CRow } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { io } from 'socket.io-client'

const Tables = () => {
  const [userData, setUserData] = useState([])
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
    let fullRecords = recordsAll.slice()
    userData.forEach((names) => {
      fullRecords.forEach((record) => {
        if (names.userID === record.userID) {
          record['fullName'] = names.name + ' ' + names.lastname
          record['userRol'] = names.userRol
        }
      })
    })
    return fullRecords
  }

  return (
    <CRow>
      <CCard className=" mb-4">
        <CCardBody>
          <h5 className="card-title mb-2">Historial</h5>
          <hr className="mt-0" />
          <div className="containerTable">
            <DataTable columns={columns} data={getNames()} pagination rowsPerPage={15} responsive />
          </div>
        </CCardBody>
      </CCard>
    </CRow>
  )
}

export default Tables
