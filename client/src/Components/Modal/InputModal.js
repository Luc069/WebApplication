import { Modal, Button } from "react-bootstrap"

import React, { useState } from "react"

import { toast } from "react-toastify"

const InputModal = (props) => {
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
            Change your Profile Picture
          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
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

export default InputModal
