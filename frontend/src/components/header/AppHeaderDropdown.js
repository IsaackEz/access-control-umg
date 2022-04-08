import React, { useState } from 'react'
import {
  CAvatar,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCollapse,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { cilBell, cilLockLocked, cilSettings, cilUser } from '@coreui/icons'

import Cookies from 'universal-cookie'

import CIcon from '@coreui/icons-react'
import admin from 'src/assets/images/user/admin.png'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)

  const navigate = useNavigate()
  const logOut = () => {
    const cookies = new Cookies()
    cookies.remove('session')
    navigate('/login')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={admin} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Notificaciones
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>

        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem onClick={() => setVisible(!visible)}>
          <CIcon icon={cilSettings} className="me-2" />
          Ajustes
        </CDropdownItem>

        <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Ajustes</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="auto" className="me-auto">
                2FA desactivado
              </CCol>

              <CCol xs="auto">
                <CButton color="success" onClick={() => setVisible2(!visible2)}>
                  Activar 2FA
                </CButton>
              </CCol>
            </CRow>
            <CRow>
              <CCollapse visible={visible2}>
                <CCard className="mt-3">
                  <CCardBody>Escanea el codigo</CCardBody>
                </CCard>
              </CCollapse>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cerrar
            </CButton>
            <CButton color="primary">Guardar cambios</CButton>
          </CModalFooter>
        </CModal>

        <CDropdownDivider />
        <CDropdownItem onClick={logOut}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Cerrar Sesion
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
