import React, { useState, useEffect, useRef } from "react"

import * as ReactBootstrap from "react-bootstrap"

import { toast } from "react-toastify"

import { AiFillCheckCircle } from "react-icons/ai"
import { GiCancel } from "react-icons/gi"

import { Tooltip } from "../"

const ProfilePicture = () => {
  const inputFile = useRef(null)

  const [PFP, setPFP] = useState()

  const [loading, setLoading] = useState(true)

  const [userPFP, setUserPFP] = useState({
    file: [],
    filepreview: null,
  })

  const [open, setOpen] = useState(false)

  const getInfo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/private", {
        method: "GET",
        headers: {
          JwtToken: localStorage.JwtToken,
        },
      })

      const parseRes = await res.json()

      setPFP(parseRes.user_profile_image)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getInfo()
  }, [])

  const handleInputChange = (event) => {
    if (
      ![".jpg", ".png", ".gif", ".jpeg", ".jpe"].some((char) =>
        event.target.files[0].name.endsWith(char)
      )
    ) {
      return toast.error("This file type is not supported")
    }

    setUserPFP({
      ...userPFP,
      file: event.target.files[0],
      filepreview: URL.createObjectURL(event.target.files[0]),
    })

    setOpen(true)
  }

  const uploadImage = async (e) => {
    e.preventDefault()
    try {
      let data = new FormData()
      data.set("key", "3249ebbd2a61eee3d096aa18e0577ce4")
      data.append("image", userPFP.file)

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: data,
      })

      const parseRes = await res.json()

      if (parseRes.status === 200) {
        const imgbbLink = parseRes.data.display_url

        const resData = { imgbbLink }

        const res = await fetch("http://localhost:5000/api/add-pfp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            JwtToken: localStorage.getItem("JwtToken"),
          },
          body: JSON.stringify(resData),
        })

        const parseResPFP = await res.json()

        if (parseResPFP.status === 429) {
          return toast.error("Too Many Requests, try again later")
        }

        toast.success("Image uploaded successfully")

        setTimeout(() => {
          window.location.reload()
        }, 200)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {loading ? (
        <ReactBootstrap.Spinner animation="border" variant="light" />
      ) : (
        <Tooltip
          element={
            <img
              onClick={() => {
                inputFile.current.click()
              }}
              className="cursor-pointer img-radius center-block"
              src={PFP}
              alt=""
              width="200"
              height="200"
            />
          }
          content="Change your profile picture"
        />
      )}

      {open ? (
        <form onSubmit={uploadImage}>
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <div className="card">
              <img
                src={userPFP.filepreview}
                alt=""
                width="200"
                height="200"
                className="cursor-pointer img-radius center-block"
              />

              <button
                type="submit"
                className="col btn btn-success mb-1 ms-1 me-1"
              >
                <AiFillCheckCircle fontSize="2rem" />
              </button>
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="col btn btn-danger mb-1 ms-1 me-1"
              >
                <GiCancel fontSize="2rem" />
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <input
        accept="image/*"
        type="file"
        ref={inputFile}
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
    </>
  )
}

export default ProfilePicture
