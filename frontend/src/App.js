import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import PrivateRoute from './views/PrivateRoute'
import PrivRoute from './views/PrivateRoute/isLogged'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route
              exact
              path="/*"
              name="Home"
              element={
                <PrivateRoute>
                  {' '}
                  <DefaultLayout />{' '}
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/login"
              name="Login Page"
              element={
                <PrivRoute>
                  <Login />
                </PrivRoute>
              }
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              element={
                <PrivateRoute>
                  <Register />
                </PrivateRoute>
              }
            />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
