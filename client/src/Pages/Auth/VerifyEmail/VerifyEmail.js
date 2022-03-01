import React, { useEffect } from "react"

import { useParams, useNavigate } from "react-router-dom"

import { toast } from "react-toastify"

const EmailVerified = () => {
  const { emailToken } = useParams()

  const navigate = useNavigate()

  const getData = async (e) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/verify-email/${emailToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const parseRes = await res.json()

      if (parseRes.success === true) {
        toast.success(parseRes.data)
        navigate("/login")
      } else {
        navigate("/404")
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default EmailVerified
