import express from "express"
import Authorize from "../Middleware/Authorize.js"
import pool from "../Config/Db.js"
import rateLimit from "express-rate-limit"
import moment from "moment"

const PostRouter = express.Router()

PostRouter.post("/add/:id", Authorize, async (req, res) => {
  const { id } = req.params
  const { postDescription, postImage } = req.body
  let user

  try {
    user = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [
      req.user.id,
    ])

    if (user.rows.length < 0) {
      return res.status(404).json("User not found")
    }

    const checkIfIn = await pool.query(
      "SELECT group_info_member = $1 FROM groups_info WHERE group_info_id = $2",
      [req.user.id, id]
    )

    if (checkIfIn.rows.length < 0) {
      return res.status(404).json("User not joined")
    }

    if (postImage) {
      if (!postImage.startsWith("https://i.ibb.co/")) {
        return res.status(400).json("Something went wrong")
      }
    }

    if (postDescription.length > 244) {
      return res.status(413)
    }

    const date = moment().format("L")

    user = await pool.query(
      "INSERT INTO posts (post_image, post_user_id, post_description, post_created_at, post_group_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [postImage, req.user.id, postDescription, date, id]
    )

    res.json("Post created successfully")
  } catch (error) {
    console.error(error)
  }
})

export default PostRouter
