import React, { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { CgLogIn } from "react-icons/cg"

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  })

  const { email, password } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value })

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { email, password }

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (res.status === 429) {
        return toast.error("Too Many Requests, try again later")
      }

      const parseRes = await res.json()

      if (parseRes.EmailSendData) {
        return toast.success(parseRes.EmailSendData)
      }
      if (parseRes.JwtToken) {
        localStorage.setItem("JwtToken", parseRes.JwtToken)

        setAuth(true)
        toast.success("Login successfuly")
      } else {
        setAuth(false)
        toast.error(parseRes)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <>
      <div className="container position-absolute top-50 start-50 translate-middle col-md-4">
        <h2 className="text-center mt-3 mb-3 font-color-white">Login</h2>
        <form onSubmit={handleSubmitForm}>
          <label className="form-label font-color-white">Email address</label>
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <div className="form-text mb-3">Your email must be valid</div>

          <label className="form-label font-color-white">Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onChange(e)}
          />
          <div className="form-text mb-3">
            Your password must be atleast 8 characters long and valid
          </div>

          <button className="col-md-12 btn btn-success" type="submit">
            Login <CgLogIn />
          </button>
          <div className="form-text">
            Not signed-up yet? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login
