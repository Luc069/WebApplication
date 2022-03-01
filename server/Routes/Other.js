import express from "express"
import Authorize from "../Middleware/Authorize.js"
import pool from "../Config/Db.js"
import rateLimit from "express-rate-limit"
import moment from "moment"

const Router = express.Router()

Router.get("/private", Authorize, async (req, res) => {
  try {
    const getInfo = await pool.query(
      "SELECT user_name, user_email, user_bio, user_profile_image FROM users WHERE user_id = $1",
      [req.user.id]
    )

    res.json(getInfo.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send("Something went wrong")
  }
})

Router.post(
  "/add-bio",
  rateLimit({
    windowMs: 5 * 60 * 1000,
    message: "429",
    max: 2,
  }),
  Authorize,
  async (req, res) => {
    const { bio } = req.body

    try {
      if (bio.length > 30) {
        return res.status(413).json("Bio is too long")
      }

      const user = await pool.query(
        "UPDATE users SET user_bio = $1 WHERE user_id = $2 RETURNING *",
        [bio, req.user.id]
      )

      res.json(user.rows[0])
    } catch (error) {
      console.error(error)
      res.status(500).send("Something went wrong")
    }
  }
)

Router.post(
  "/add-pfp",
  rateLimit({
    windowMs: 5 * 60 * 1000,
    message: "429",
    max: 2,
  }),
  Authorize,
  async (req, res) => {
    const { imgbbLink } = req.body

    try {
      if (!imgbbLink.startsWith("https://i.ibb.co/")) {
        return res.status(400).json("Something went wrong")
      }

      await pool.query(
        "UPDATE users SET user_profile_image = $1 WHERE user_id = $2",
        [imgbbLink, req.user.id]
      )

      res.json("PFP updated successfully")
    } catch (error) {
      console.error(error.message)
    }
  }
)

export default Router
