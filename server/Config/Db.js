import pg from "pg"
import { config } from "./config.js"

const pool = new pg.Pool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  port: config.dbport,
  database: config.database,
})

export default pool
