import React, {
  useState
} from 'react'

import {
  useNavigate,
  useParams
} from "react-router-dom"

import {
  toast
} from "react-toastify"

const ChangePassword = ({ setAuth }) => {

  const { resetToken } = useParams()

  const navigate = useNavigate()

  const [ inputs, setInputs ] = useState({
    password: ""
  })

  const  { password } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value
  })

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { password }

      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${resetToken}`, { 
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })

      const parseRes = await res.json()

      if(parseRes.success === true) {
        localStorage.removeItem("JwtToken")
        setAuth(false)
        toast.success("Password changed successfully")
        setTimeout(() => {
          navigate("/login")
        }, 500);
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
        <h2 className="text-center mt-3 mb-3 font-color-white">Reset password</h2>
        <form onSubmit={handleSubmitForm}>

          <label className="form-label font-color-white">New password</label>
          <input 
            className="form-control"
            type="password"
            name="password"
            placeholder="New password"
            value={password}
            onChange={e => onChange(e)} 
          />
          <div className="form-text mb-3">
            Your password must be valid
          </div>
          <button className="col-md-12 btn btn-success" type="submit">Reset password</button>
        </form>
      </div>
    </>
  )
}

export default ChangePassword
