import express from "express"
import moment from "moment"
import pool from "../Config/Db.js"
import JwtGenerator from "../Utils/JwtGenerator.js"
import crypto from "crypto"
import ValidInfo from "../Middleware/ValidInfo.js"
import bcrypt from "bcryptjs"
import Authorize from "../Middleware/Authorize.js"
import SendEmail from "../Utils/SendEmail.js"
import { rateLimit } from "express-rate-limit"

const AuthRouter = express.Router()

AuthRouter.post(
  "/register",
  rateLimit({
    windowMs: 1 * 60 * 1000,
    message: "429",
    max: 5,
  }),
  ValidInfo,
  async (req, res) => {
    const { username, email, password } = req.body

    try {
      const checkEmail = await pool.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      )

      const checkUsername = await pool.query(
        "SELECT * FROM users WHERE user_name = $1",
        [username]
      )

      if (checkEmail.rows.length > 0 || checkUsername.rows.length > 0) {
        return res.status(401).json("Email or Username is already in use")
      }

      if (password.length < 8) {
        return res.status(400).json("Password must be at least 8 characters")
      }

      const salt = await bcrypt.genSalt(10)
      const bcryptPassword = await bcrypt.hash(password, salt)

      const date = moment().format("L")

      const dateJoined = `${date}`

      const token = crypto.randomBytes(40).toString("hex")

      const emailToken = crypto.createHash("sha256").update(token).digest("hex")

      const PFP = [
        "https://i.ibb.co/7SztnZX/Your-paragraph-text.png",
        "https://i.ibb.co/cTNS2Jz/Untitled-design-1.png",
      ]

      const randomPFP = PFP[Math.floor(Math.random() * PFP.length)]

      const user = await pool.query(
        "INSERT INTO users (user_name, user_email, user_password, user_join_date, user_email_verified, user_profile_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [username, email, bcryptPassword, dateJoined, emailToken, randomPFP]
      )

      const resetUrl = `http://localhost:3000/verify-email/${emailToken}`

      const message = `
      <h1>Hey bro</h1>
      <p>Please click to a following link to verify your email:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `

      const emailg = SendEmail({
        to: email,
        subject: "Verify your email",
        text: message,
      })

      console.log(emailg)

      res.status(200).json({
        data: "Verification email sent",
      })
    } catch (error) {
      console.error(error)
      res.status(500).json("Something went wrong")
    }
  }
)

AuthRouter.post(
  "/login",
  rateLimit({
    windowMs: 1 * 60 * 1000,
    message: "429",
    max: 5,
  }),
  ValidInfo,
  async (req, res) => {
    const { email, password } = req.body

    try {
      const user = await pool.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      )

      if (user.rows.length === 0) {
        return res.status(401).json("Password or Email is incorrect")
      }

      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      )

      if (!validPassword) {
        return res.status(401).json("Invalid Credential")
      }

      if (user.rows[0].user_email_verified === "true") {
        const JwtToken = JwtGenerator(user.rows[0].user_id)
        return res.status(200).json({ JwtToken })
      }

      return res.status(200).json({
        EmailSendData: "Verification email sent",
      })
    } catch (error) {
      console.error(error)
      res.status(500).send("Something went wrong")
    }
  }
)

AuthRouter.post("/change-username", Authorize, async (req, res) => {
  const { username } = req.body
  try {
    if (!username) {
      return res.status(400).json("Please fill in all fields")
    }

    const previousUsername = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user.id]
    )

    if (previousUsername.rows.length < 0) {
      return res.status(401).json("User doesn't exist")
    }

    const checkNewUsername = await pool.query(
      "SELECT * FROM users WHERE user_name = $1",
      [previousUsername]
    )

    if (checkNewUsername.rows.length > 0) {
      return res.status(401).json("Username is already in use")
    }

    const checkDateInDB = await pool.query(
      "SELECT user_new_username_update_date FROM users WHERE user_id = $1",
      [req.user.id]
    )

    const resetDate = checkDateInDB.rows[0].user_new_username_update_date

    const currentDate = moment().format("L")

    if (resetDate > currentDate) {
      return res.json(
        `Sorry, you can't change the username right now. Try again at ${resetDate}`
      )
    }

    const newUpdateDate = moment().add(1, "days").format("L")

    await pool.query(
      "UPDATE users SET user_name = $1, user_new_username_update_date = $2 WHERE user_id = $3",
      [username, newUpdateDate, req.user.id]
    )

    return res.status(200).json("Username changed")
  } catch (error) {
    console.error(error)
    res.status(500).send("Something went wrong")
  }
})

AuthRouter.post("/forgot-password", ValidInfo, async (req, res) => {
  const { email } = req.body

  try {
    const user = await pool.query(
      "SELECT user_id, user_email_verified FROM users WHERE user_email = $1",
      [email]
    )

    if (user.rows.length === 0 || user.rows[0].user_email_verified !== "true") {
      return res.status(404).json("Email could not be sent")
    }

    const token = crypto.randomBytes(40).toString("hex")

    const resetToken = crypto.createHash("sha256").update(token).digest("hex")

    await pool.query(
      "UPDATE users SET user_password_reset_token = $1 WHERE user_id = $2",
      [resetToken, user.rows[0].user_id]
    )

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please click to a following link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `

    try {
      SendEmail({
        to: email,
        subject: "Password Reset Request",
        text: message,
      })

      res.status(200).json({
        success: true,
        data: "Email Sent",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json("Thedd email could not be sent" + error)
    }
  } catch (error) {
    console.error(error)
  }
})

AuthRouter.put(
  "/reset-password/:resetToken",
  rateLimit({
    windowMs: 200 * 60 * 1000,
    message: "429",
    max: 2,
  }),
  ValidInfo,
  async (req, res) => {
    const token = req.params.resetToken
    const { password } = req.body

    try {
      const user = await pool.query(
        "SELECT * FROM users WHERE user_password_reset_token = $1",
        [token]
      )

      if (user.rows.length === 0) {
        return res.status(400).json("Invalid reset token")
      }

      if (password.length < 8) {
        return res.status(400).json("Password must be at least 8 characters")
      }

      const samePassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      )

      if (samePassword) {
        return res.json(
          "Password is the same as previous. Please choose a new one."
        )
      }

      const salt = await bcrypt.genSalt(10)
      const bcryptPassword = await bcrypt.hash(password, salt)

      await pool.query(
        "UPDATE users SET user_password_reset_token = null, user_password = $1 WHERE user_id = $2",
        [bcryptPassword, user.rows[0].user_id]
      )

      res.status(201).json({
        success: true,
        data: "Password Updated Success",
      })
    } catch (error) {
      console.error(error)
    }
  }
)

AuthRouter.put("/verify-email/:emailToken", async (req, res) => {
  const token = req.params.emailToken

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE user_email_verified = $1",
      [token]
    )

    if (user.rows.length === 0) {
      return res.status(400).json("Invalid verify token")
    }

    await pool.query(
      "UPDATE users SET user_email_verified = true WHERE user_email_verified = $1",
      [token]
    )

    res.status(201).json({
      success: true,
      data: "Email verified",
    })
  } catch (error) {
    console.error(error)
  }
})

AuthRouter.get("/verify-reset-token/:resetToken", async (req, res) => {
  const token = req.params.resetToken
  try {
    const user = await pool.query(
      "SELECT user_password_reset_token FROM users WHERE user_password_reset_token = $1",
      [token]
    )

    if (user.rows.length === 0) {
      return res.json(false)
    } else {
      return res.json(true)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Something went wrong")
  }
})

AuthRouter.get("/verify", Authorize, (req, res) => {
  try {
    res.json(true)
  } catch (error) {
    console.error(error)
    res.status(500).send("Something went wrong")
  }
})

export default AuthRouter
