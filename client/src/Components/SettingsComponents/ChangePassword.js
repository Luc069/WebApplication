import React from 'react'

import {
  useNavigate
} from "react-router-dom"

import {
  BsPencilFill
} from "react-icons/bs"

const ChangeEmail = () => {

  const navigate = useNavigate()

  return (
    <>
      <h2 className="color-white">Password: {('•').repeat(18)}  <button onClick={() => navigate("/forgot-password")} className="pencil-button"><BsPencilFill fontSize="25px" /></button></h2>
    </>
  )
}

export default ChangeEmail