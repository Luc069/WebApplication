import React, {
  useState
} from 'react'

import {
  toast
} from "react-toastify"

const ChangeBio = () => {

  const [ inputs, setInputs ] = useState({
    bio: ""
  })

  const  { bio } = inputs

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value
  })

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { bio }

      const res = await fetch("http://localhost:5000/api/add-bio", { 
        method: "POST",
        headers: {
          JwtToken: localStorage.getItem('JwtToken'),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })

      if (res.status === 429) {
        return toast.error("Too Many Requests, try again later.")
      }

      if (res.status === 413) {
        return toast.error("Bio is too long")
      }
      
      return toast.success("Bio changed successfully")

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
        <form onSubmit={handleSubmitForm}>
          <label className="color-white">Your bio</label>
          <textarea style={{resize: "none"}} type="text" name="bio" value={bio} onChange={(e) => onChange(e)} className="mb-1 form-control bio-input">
          </textarea>
          <button className="btn btn-success" type="submit">Save</button>
        </form>
    </>
  )
}

export default ChangeBio