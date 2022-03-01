import React, { useState, useEffect } from "react"

import { Posts, GroupPage, AddPost } from "../../Components/index.js"

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("")

  const getName = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/private", {
        method: "GET",
        headers: {
          JwtToken: localStorage.getItem("JwtToken"),
        },
      })

      const parseRes = await res.json()

      setName(parseRes.user_name)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getName()
  }, [])

  return (
    <>
      <div className="container">
        <div className="d-flex">
          <div>
            <div className="mb-3">
              <AddPost />
            </div>
            <Posts />
          </div>
          <div className="ms-2 sticky-1">
            <GroupPage />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
