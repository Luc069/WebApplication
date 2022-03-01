import jwt from "jsonwebtoken"
import { config } from "../Config/config.js"

const Authorize = (req, res, next) => {
  const token = req.header("JwtToken")

  if (!token) {
    return res.status(403).json({ msg: "authorization denied" })
  }

  try {
    const verify = jwt.verify(token, config.JwtSecretKey)
    req.user = verify.user
    next()
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}

export default Authorize
