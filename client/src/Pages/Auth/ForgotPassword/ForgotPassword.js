import React, { useState } from "react"

import { toast } from "react-toastify"

const ForgotPassword = () => {
  const [inputs, setInputs] = useState({
    email: "",
  })

  const { email } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value })

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { email }

      const res = await fetch(
        `http://localhost:5000/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )

      const parseRes = await res.json()

      if (parseRes.success === true) {
        toast.success("Email sent successfully")
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
        <h2 className="text-center mt-3 mb-3 font-color-white">
          Forgot password
        </h2>
        <form onSubmit={handleSubmitForm}>
          <label className="form-label font-color-white">Your email</label>
          <input
            className="form-control outline-none"
            type="email"
            name="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <div className="form-text mb-3">Your email must be valid</div>
          <button className="col-md-12 btn btn-success" type="submit">
            Send email link
          </button>
        </form>
      </div>
    </>
  )
}

export default ForgotPassword
