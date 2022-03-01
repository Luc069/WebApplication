import React, { useState, useEffect } from "react"

import { BsFillImageFill } from "react-icons/bs"

import "./styles.css"

const Posts = (props) => {
  const [listOfPosts, setListOfPosts] = useState([])

  const getPostInfo = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/group/get-posts/${props.groupID}`,
        {
          method: "GET",
          headers: {
            JwtToken: localStorage.getItem("JwtToken"),
          },
        }
      )

      const parseRes = await res.json()

      setListOfPosts(parseRes)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPostInfo()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {listOfPosts.reverse().map((post) => {
        return (
          <div className="mb-3 container post-outline">
            <div className="mb-3 mt-3">
              <div className="d-flex">
                <img
                  className="img-radius-1 me-2"
                  width="40"
                  height="40"
                  src={post.user_profile_image}
                  alt=""
                />
                <h2 className="color-white me-2">{post.user_name}</h2>
              </div>
              <h5 className="color-white text-break">
                {post.post_image ? (
                  <a className="me-2" target="_img" href={post.post_image}>
                    <BsFillImageFill color="white" fontSize="1rem" />
                  </a>
                ) : null}
                {post.post_description}
              </h5>
              <div className="container justify-end"></div>
              <h9 className="color-white">{post.post_created_at} • ♥️ Likes</h9>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default Posts
