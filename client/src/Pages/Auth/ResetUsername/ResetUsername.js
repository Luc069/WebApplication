import React, {
  useState
} from 'react'

import {
  toast
} from "react-toastify"

import {
  useNavigate
} from "react-router-dom"

const ResetUsername = () => {

  const navigate = useNavigate()

  const [ inputs, setInputs ] = useState({
    username: "",
  })

  const { username } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value
  })

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { username }

      const res = await fetch("http://localhost:5000/api/auth/change-username", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          JwtToken: localStorage.JwtToken
        },
        body: JSON.stringify(body)
      })

      const parseRes = await res.json()

      if (parseRes === "Username changed") {
        toast.success("Username changed succesfully") 
        setTimeout(() => {
          navigate("/settings")
        }, 500)
      } else {
        toast.error(parseRes)
      }
      
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="container position-absolute top-50 start-50 translate-middle col-md-4">
        <h2 className="text-center mt-3 mb-3 font-color-white">Reset username</h2>
        <form onSubmit={handleSubmitForm}>

          <label className="form-label font-color-white">New username</label>
          <input 
            className="form-control"
            type="username"
            name="username"
            placeholder="New username"
            value={username}
            onChange={e => onChange(e)} 
          />
          <div className="form-text mb-3">
            Your username must be valid
          </div>
          <button className="col-md-12 btn btn-success" type="submit">Reset username</button>
        </form>
      </div>
    </>
  )
}

export default ResetUsername