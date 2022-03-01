import { Modal, Button } from "react-bootstrap"

import React, { useState } from "react"

import { toast } from "react-toastify"

const InputModalGroup = (props) => {
  const [groupPFP, setGroupPFP] = useState({
    file: [],
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

    setGroupPFP({
      ...groupPFP,
      file: event.target.files[0],
      filepreview: URL.createObjectURL(event.target.files[0]),
    })
  }

  const uploadImage = async () => {
    try {
      let data = new FormData()
      data.set("key", "3249ebbd2a61eee3d096aa18e0577ce4")
      data.append("image", groupPFP.file)

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: data,
      })

      const parseRes = await res.json()

      if (parseRes.status === 200) {
        const imgbbLink = parseRes.data.display_url

        const resData = { imgbbLink }

        const parseResPFP = await fetch("http://localhost:5000/api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            JwtToken: localStorage.getItem("JwtToken"),
          },
          body: JSON.stringify(resData),
        })

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
    <form onSubmit={uploadImage}>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Group Profile Picture
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            accept="image/*"
            type="file"
            className="form-control"
            name="upload_file"
            onChange={handleInputChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={props.onHide}
          >
            Close
          </Button>
          <Button
            type="submit"
            className="btn btn-success"
            onClick={() => uploadImage()}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  )
}

export default InputModalGroup
