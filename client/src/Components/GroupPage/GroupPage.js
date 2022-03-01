import React, { useState, useEffect } from "react"

import "./styles.css"

const GroupPage = (props) => {
  const [groupInfo, setGroupInfo] = useState({
    groupPFP: "",
    groupName: "",
    groupAbout: "",
  })

  const [groupMembers, setGroupMembers] = useState([])

  const getInfo = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/group/get-info/${props.groupID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            JwtToken: localStorage.getItem("JwtToken"),
          },
        }
      )

      const parseRes = await res.json()

      setGroupInfo({
        groupPFP: parseRes.group_profile_image,
        groupName: parseRes.group_name,
        groupAbout: parseRes.group_about,
      })

      const res1 = await fetch(
        `http://localhost:5000/api/group/get-members/${props.groupID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            JwtToken: localStorage.getItem("JwtToken"),
          },
        }
      )

      const parseRes1 = await res1.json()

      setGroupMembers(parseRes1)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div
        style={{ width: "18rem", margin: "0 auto" }}
        className="card card-z-index mb-2"
      >
        <img
          src={groupInfo.groupPFP}
          width="285"
          height="285"
          alt=""
          className="img-radius align-center"
        />

        <div className="card-body">
          <h4 className="card-title text-center">{groupInfo.groupName}</h4>
          <div
            style={{
              borderRadius: "5px",
              backgroundColor: "#232023",
              color: "#fff",
            }}
          >
            <h6 className="d-inline-block text-center m-2">
              {groupInfo.groupAbout}
            </h6>
          </div>
        </div>
      </div>
      {groupMembers.map((member) => {
        return (
          <div className="card">
            {member.group_info_member} {member.user_name}
          </div>
        )
      })}
    </>
  )
}

export default GroupPage
