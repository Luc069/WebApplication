import React, { useState, useRef } from "react"

import { toast } from "react-toastify"

import { Tooltip } from "../../../Components"

const Create = () => {
  const inputFile = useRef(null)

  const [groupPFP, setGroupPFP] = useState({
    file: [],
    filepreview: null,
  })

  const [inputs, setInputs] = useState({
    groupName: "",
    groupAbout: "",
  })

  const { groupName, groupAbout } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (groupPFP.filepreview != null) {
        let imgData = new FormData()
        imgData.set("key", "3249ebbd2a61eee3d096aa18e0577ce4")
        imgData.append("image", groupPFP.file)

        const imgRes = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: imgData,
        })

        const parseImgRes = await imgRes.json()

        if (parseImgRes.status === 200) {
          const imgbbLink = parseImgRes.data.display_url

          const resData = {
            groupProfileImage: imgbbLink,
            groupName,
            groupAbout,
          }

          const res = await fetch("http://localhost:5000/api/group/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              JwtToken: localStorage.getItem("JwtToken"),
            },
            body: JSON.stringify(resData),
          })

          const parseRes = await res.json()

          if (res.status === 429) {
            return toast.error("Too Many Requests, try again later")
          }

          if (res.status !== 200) {
            return toast.error(parseRes)
          }

          return toast.success("Group created successfully")
        }
      } else {
        const imgbbLink = "https://i.ibb.co/hFc0pBF/Untitled-design-1.png"

        const resData = { groupProfileImage: imgbbLink, groupName, groupAbout }

        const res = await fetch("http://localhost:5000/api/group/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            JwtToken: localStorage.getItem("JwtToken"),
          },
          body: JSON.stringify(resData),
        })

        const parseRes = await res.json()

        if (res.status === 429) {
          return toast.error("Too Many Requests, try again later")
        }

        if (res.status !== 200) {
          return toast.error(parseRes)
        }

        return toast.success("Group created successfully")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleInputChange = (event) => {
    if (
      ![".jpg", ".png", ".gif", ".jpeg", ".jpe"].some((char) =>
        event.target.files[0].name.endsWith(char)
      )
    ) {
      return toast.error("This file type is not supported")
    }

    setGroupPFP({
      ...groupPFP,
      file: event.target.files[0],
      filepreview: URL.createObjectURL(event.target.files[0]),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="position-absolute top-50 start-50 translate-middle">
        <div className="row">
          <div className="col mb-2">
            <Tooltip
              element={
                groupPFP.filepreview ? (
                  <img
                    onClick={() => {
                      inputFile.current.click()
                    }}
                    className="cursor-pointer img-radius center-block mb-2"
                    alt=""
                    src={groupPFP.filepreview}
                    width="200"
                    height="200"
                  />
                ) : (
                  <img
                    onClick={() => {
                      inputFile.current.click()
                    }}
                    className="cursor-pointer img-radius center-block mb-2"
                    alt=""
                    src="https://i.ibb.co/hFc0pBF/Untitled-design-1.png"
                    width="200"
                    height="200"
                  />
                )
              }
              content="Change group profile picture"
            />
          </div>
          <div className="col">
            <h4 className="color-white mb-2">Create a new group</h4>
            <label className="form-label font-color-white">Group name</label>
            <input
              className="form-control mb-2"
              type="text"
              name="groupName"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => onChange(e)}
            />
            <label className="form-label font-color-white">About group</label>
            <textarea
              style={{ resize: "none" }}
              type="text"
              name="groupAbout"
              placeholder="About group"
              className="mb-2 form-control bio-input"
              value={groupAbout}
              onChange={(e) => onChange(e)}
            ></textarea>
            <button className="btn btn-success">Create</button>
          </div>
        </div>
        <input
          accept="image/*"
          type="file"
          ref={inputFile}
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
      </div>
    </form>
  )
}

export default Create
