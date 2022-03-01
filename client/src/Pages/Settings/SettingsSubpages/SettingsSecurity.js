import React from "react"

import { toast } from "react-toastify"

import { useNavigate } from "react-router-dom"

import ChangePassword from "../../../Components/SettingsComponents/ChangePassword"

const SettingsSecurity = ({ setAuth }) => {
    const navigate = useNavigate()

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("JwtToken")
        setAuth(false)
        toast.success("Logged out successfully")
    }

    return (
        <>
            <div className="d-flex flex-column flex-shrink-0">
                <div className="nav-flush flex-column mb-auto text-center">
                    <button
                        onClick={() => navigate("/settings")}
                        className="main-button col"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => navigate("/settings/security")}
                        className="main-button col"
                    >
                        Security
                    </button>
                    <button
                        onClick={(e) => logout(e)}
                        className="main-button-red col"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="position-absolute top-50 start-50 translate-middle">
                <ChangePassword />
            </div>
        </>
    )
}

export default SettingsSecurity
