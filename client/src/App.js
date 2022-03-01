import React, { useState, useEffect } from "react"

import { toast } from "react-toastify"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import {
  Login,
  Register,
  Dashboard,
  Settings,
  ResetPassword,
  ForgotPassword,
  ResetUsername,
  VerifyEmail,
  SettingsSecurity,
  Create,
  Main,
  Error,
} from "./Pages"

import { Navbar, PrivateRoute } from "./Components"

import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"

toast.configure({
  theme: "colored",
})

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState()

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean)
  }

  const isAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        headers: { JwtToken: localStorage.JwtToken },
      })

      const parseRes = await res.json()

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    isAuth()
  }, [])

  return (
    <>
      <Router>
        <Navbar setAuth={setAuth} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route
            element={
              <PrivateRoute.AnonymousLayout
                isAuthenticated={isAuthenticated}
                to="/dashboard"
              />
            }
          >
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/register" element={<Register setAuth={setAuth} />} />
          </Route>
          <Route
            element={
              <PrivateRoute.AuthLayout isAuthenticated={isAuthenticated} />
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard setAuth={setAuth} />}
            />
            <Route
              path="/settings"
              element={
                <Settings setAuth={setAuth} isAuthenticated={isAuthenticated} />
              }
            />
            <Route
              path="/settings/security"
              element={
                <SettingsSecurity
                  setAuth={setAuth}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
            <Route
              path="/reset-username"
              element={
                <ResetUsername
                  setAuth={setAuth}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
            <Route
              path="/group/create"
              element={
                <Create setAuth={setAuth} isAuthenticated={isAuthenticated} />
              }
            />
            <Route
              path="/group/:id"
              element={
                <Main setAuth={setAuth} isAuthenticated={isAuthenticated} />
              }
            />
          </Route>
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword setAuth={setAuth} />}
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:emailToken" element={<VerifyEmail />} />
          <Route path="/404" element={<Error />} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
