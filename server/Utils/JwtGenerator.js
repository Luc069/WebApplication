import jwt from "jsonwebtoken"
import { config } from "../Config/config.js"

const JwtGenerator = (user_id) => {
  const payload = {
    user: {
      id: user_id,
    },
  }

  return jwt.sign(payload, config.JwtSecretKey, { expiresIn: "365d" })
}

export default JwtGenerator
