import React, { useState, useEffect } from "react"

import { Link } from "react-router-dom"

import * as ReactBootstrap from "react-bootstrap"

import Logo from "../../Media/Logo/Transparent.svg"

import "./styles.css"

import { BiArrowBack } from "react-icons/bi"

const Navbar = ({ isAuthenticated }) => {
  const [loading, setLoading] = useState(true)
  const [PFP, setPFP] = useState("")
  const [open, setOpen] = useState(false)

  const openDropdown = () => setOpen(true)
  const closeDropdown = () => setOpen(false)

  const getName = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/api/private", {
        method: "GET",
        headers: {
          JwtToken: localStorage.JwtToken,
        },
      })

      const parseRes = await res.json()

      setPFP(parseRes.user_profile_image)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getName()
  }, [isAuthenticated])

  return (
    <>
      <nav className="navbar sticky-nav z-index">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img alt="logo" src={Logo} />
          </Link>
          <div className="me-1">
            {loading ? (
              <ReactBootstrap.Spinner animation="border" variant="light" />
            ) : isAuthenticated ? (
              <div className="d-flex">
                <form>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search..."
                  />
                </form>
                <div>
                  {open ? (
                    <img
                      onClick={closeDropdown}
                      width="40"
                      height="40"
                      className="position-relative cursor-pointer ms-3 font-color-white img-radius-1"
                      alt=""
                      src={PFP}
                    />
                  ) : (
                    <img
                      onClick={openDropdown}
                      width="40"
                      height="40"
                      className="position-relative cursor-pointer ms-3 font-color-white img-radius-1"
                      alt=""
                      src={PFP}
                    />
                  )}
                </div>
              </div>
            ) : (
              <h2 className="font-color-white">Login</h2>
            )}
          </div>
        </div>

        {open ? (
          <>
            <div
              className={
                open
                  ? "sticky dropdown container position-absolute end-0 col-md-2 m-2"
                  : "dropdown-out"
              }
            >
              <div
                onClick={closeDropdown}
                className="dropdown-item cursor-pointer"
              >
                <BiArrowBack />
              </div>
              <Link className="unstyled-link dropdown-item" to="/profile">
                <div onClick={closeDropdown} className="cursor-pointer">
                  Profile
                </div>
              </Link>
              <Link className="unstyled-link dropdown-item" to="/settings">
                <div onClick={closeDropdown} className="cursor-pointer">
                  Settings
                </div>
              </Link>
              <Link className="unstyled-link dropdown-item" to="/group/create">
                <div onClick={closeDropdown} className="cursor-pointer">
                  Create a new group
                </div>
              </Link>
            </div>
          </>
        ) : null}
      </nav>
    </>
  )
}

export default Navbar
