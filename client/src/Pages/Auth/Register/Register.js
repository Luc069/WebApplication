import React, {
  useState
} from 'react'
import {
  Link
} from "react-router-dom"
import { toast } from "react-toastify"
import { CgLogIn } from "react-icons/cg"

import "./styles.css"

const Register = ({ setAuth }) => {

  const [ inputs, setInputs ] = useState({
    username: "",
    email: "",
    password: "",
  })

  const  { username, email, password } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value
  })

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { username, email, password }

      const res = await fetch("http://localhost:5000/api/auth/register", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })

      const parseRes = await res.json()

      console.log(parseRes)

      if(parseRes.data) {
        toast.success(parseRes.data)
      } else {
        setAuth(false)
        toast.error(parseRes)
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
        <div className="container position-absolute top-50 start-50 translate-middle col-md-4">
          <h2 className="text-center mt-3 mb-3 font-color-white">Register</h2>
          <form onSubmit={handleSubmitForm}>

            <label className="form-label font-color-white">Username</label>
            <input
              className="form-control"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={e => onChange(e)}
            />
            <div className="form-text mb-3">
              Valid username
            </div>

            <label className="form-label font-color-white">Email address</label>
            <input 
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => onChange(e)}
            />
            <div className="form-text mb-3">
              Valid email
            </div>

            <label className="form-label font-color-white">Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => onChange(e)}
            />
            <div className="form-text mb-3">
              Your password must be atleast 8 characters long
            </div>

            <button className="col-md-12 btn btn-success" type="submit">Register<CgLogIn /></button>
            <div className="form-text font-color-white">
              Already signed-in? <Link to="/login">Login</Link> 
            </div>
          </form>
        </div>
    </>
  )
};

export default Register
