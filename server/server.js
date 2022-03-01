import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

import AuthRouter from "./Routes/Auth.js"
import PostRouter from "./Routes/Post.js"
import GroupRouter from "./Routes/Group.js"
import Router from "./Routes/Other.js"

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use("/api/auth/", AuthRouter)
app.use("/api/post/", PostRouter)
app.use("/api/group/", GroupRouter)
app.use("/api/", Router)

app.set("trust proxy", true)

app.listen(5000, () => {
  console.log("Listening on port 5000")
})
