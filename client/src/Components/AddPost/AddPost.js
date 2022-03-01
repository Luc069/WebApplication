import React, { useState, useRef } from "react"

import { BsFillImageFill, BsCode } from "react-icons/bs"

import { AiOutlineSend } from "react-icons/ai"

import "./styles.css"
import { toast } from "react-toastify"

const AddPost = (props) => {
  const [userPFP, setUserPFP] = useState({
    file: null,
    filepreview: null,
  })

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
  }

  const inputFile = useRef(null)

  const [inputs, setInputs] = useState({
    postDescription: null,
  })

  const { postDescription } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value })

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      if (userPFP.filepreview != null) {
        let data = new FormData()
        data.set("key", "3249ebbd2a61eee3d096aa18e0577ce4")
        data.append("image", userPFP.file)

        const imgRes = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: data,
        })

        const parseImgRes = await imgRes.json()

        if (!parseImgRes.status === 200) {
          return toast.error("Something went wrong")
        }

        const image = parseImgRes.data.display_url

        const body = { postDescription, postImage: image }

        const res = await fetch(
          `http://localhost:5000/api/post/add/${props.groupID}`,
          {
            method: "POST",
            headers: {
              JwtToken: localStorage.getItem("JwtToken"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        )

        if (res.status === 429) {
          return toast.error("Too Many Requests, try again later.")
        }

        if (res.status === 413) {
          return toast.error("Description is too long")
        }

        toast.success("Posted successfully")

        return setTimeout(() => {
          window.location.reload()
        }, 300)
      } else {
        const body = { postDescription, postImage: "" }

        const res = await fetch(
          `http://localhost:5000/api/post/add/${props.groupID}`,
          {
            method: "POST",
            headers: {
              JwtToken: localStorage.getItem("JwtToken"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        )

        if (res.status === 429) {
          return toast.error("Too Many Requests, try again later.")
        }

        if (res.status === 413) {
          return toast.error("Description is too long")
        }

        toast.success("Posted successfully")

        return setTimeout(() => {
          window.location.reload()
        }, 300)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmitForm}>
      <div className="add-post-outline div-size">
        <textarea
          rows="7"
          className="form-control radius mb-2"
          style={{ resize: "none" }}
          value={postDescription}
          name="postDescription"
          type="text"
          onChange={(e) => onChange(e)}
        ></textarea>
        <div className="container align-middle">
          {userPFP.filepreview ? (
            <img
              onClick={
                //
                () => {
                  setUserPFP({
                    file: null,
                    filepreview: null,
                  })
                }
              }
              width="30"
              className="me-2 cursor-pointer"
              src={userPFP.filepreview}
              alt=""
            />
          ) : (
            <BsFillImageFill
              onClick={() => inputFile.current.click()}
              className="cursor-pointer color-white me-2"
              fontSize="2rem"
            />
          )}

          <BsCode className="color-white me-2" fontSize="2rem" />
          <button className="transparent-button" type="submit">
            <AiOutlineSend className="color-white" fontSize="1.8rem" />
          </button>
        </div>
      </div>
      <input
        accept="image/*"
        type="file"
        ref={inputFile}
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
    </form>
  )
}

export default AddPost
