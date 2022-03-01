import React, { useEffect } from "react"

import { useParams, useNavigate } from "react-router-dom"

import { Posts, GroupPage, AddPost } from "../../../Components"

import "./styles.css"

const Main = () => {
  const navgate = useNavigate()

  const { id } = useParams()

  const checkIfExist = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/group/exist/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          JwtToken: localStorage.getItem("JwtToken"),
        },
      })

      const parseRes = await res.json()

      if (!parseRes === true) {
        navgate("/404")
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    checkIfExist()
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="flex-grow-1">
            <div className="mb-3">
              <AddPost groupID={id} />
            </div>
            <Posts groupID={id} />
          </div>
          <div className="ms-2 sticky-1">
            <GroupPage groupID={id} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
