import React, {
  useState,
  useEffect
} from 'react'

import {
  useNavigate
} from "react-router-dom"

import {
  BsPencilFill
} from "react-icons/bs"

import * as ReactBootstrap from "react-bootstrap" 

const ChangeUsername = () => {

  const navigate = useNavigate()

  const [ loading, setLoading ] = useState(true)

  const [isShown, setIsShown] = useState(false)

  const [ name, setName ] = useState("")

  const getInfo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/private", {
        method: "GET",
        headers: {
          JwtToken: localStorage.JwtToken
        }
      })

      const parseRes = await res.json()

      setName(parseRes.user_name)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <>
      <h2 className="font-color-white">
        {loading ? <ReactBootstrap.Spinner animation="border" variant="light" /> : (
          <h3 onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} >Username: {isShown ? <BsPencilFill className="color-white cursor-pointer" onClick={() => navigate("/reset-username")} /> : name}</h3>
        )}
      </h2>
    </>
  )
}

export default ChangeUsername