import express from "express"
import Authorize from "../Middleware/Authorize.js"
import pool from "../Config/Db.js"
import rateLimit from "express-rate-limit"
import moment from "moment"

const GroupRouter = express.Router()

GroupRouter.post("/create", Authorize, async (req, res) => {
  const { groupProfileImage, groupAbout, groupName } = req.body

  try {
    if (!groupProfileImage | !groupName | !groupAbout) {
      return res.status(400).json("Please fill in all the fields")
    }
    if (groupName.length > 16) {
      return res.status(413).json("Group name is too long")
    }
    if (!groupProfileImage.startsWith("https://i.ibb.co/")) {
      return res.status(400).json("Something went wrong")
    }

    if (groupAbout.length > 244) {
      return res.status(413).json("About group is too long")
    }

    const date = moment().format("L")

    const group = await pool.query(
      "INSERT INTO groups (group_profile_image, group_admin_id, group_about, group_name, group_created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [groupProfileImage, req.user.id, groupAbout, groupName, date]
    )

    await pool.query(
      "INSERT INTO groups_info (group_info_id, group_info_member) VALUES ($1, $2) RETURNING *",
      [group.rows[0].group_id, req.user.id]
    )

    res.status(200).json("Group created successfully")
  } catch (error) {
    console.error(error)
  }
})

GroupRouter.get("/get-posts/:id", Authorize, async (req, res) => {
  const { id } = req.params

  try {
    const checkIfIn = await pool.query(
      "SELECT group_info_member = $1 FROM groups_info WHERE group_info_id = $2",
      [req.user.id, id]
    )

    if (checkIfIn.rows.length < 0) {
      return res.status(404).json("User not joined")
    }

    const getPosts = await pool.query(
      `
      SELECT posts.post_image, posts.post_description, posts.post_created_at, users.user_name, users.user_profile_image, users.user_id
      FROM posts
      INNER JOIN users ON posts.post_user_id = users.user_id
      WHERE posts.post_group_id = $1
      `,
      [id]
    )

    res.json(getPosts.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send("Something went wrong")
  }
})

GroupRouter.get("/get-info/:id", Authorize, async (req, res) => {
  const { id } = req.params

  try {
    const checkIfIn = await pool.query(
      "SELECT group_info_member = $1 FROM groups_info WHERE group_info_id = $2",
      [req.user.id, id]
    )

    if (checkIfIn.rows.length < 0) {
      return res.status(404).json("User not joined")
    }

    const getInfo = await pool.query(
      `
      SELECT groups.group_admin_id, groups.group_name, groups.group_about, groups.group_profile_image
      FROM groups
      WHERE group_id = $1
      `,
      [id]
    )

    res.json(getInfo.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send("Something went wrong")
  }
})

GroupRouter.get("/get-members/:id", Authorize, async (req, res) => {
  const { id } = req.params

  try {
    const checkIfIn = await pool.query(
      "SELECT group_info_member = $1 FROM groups_info WHERE group_info_id = $2",
      [req.user.id, id]
    )

    if (checkIfIn.rows.length < 0) {
      return res.status(404).json("User not joined")
    }

    const getMembers = await pool.query(
      `
      SELECT groups_info.group_info_member, users.user_name, users.user_profile_image
      FROM groups_info
      INNER JOIN users ON groups_info.group_info_member = users.user_id
      WHERE groups_info.group_info_id = $1
      `,
      [id]
    )

    res.json(getMembers.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send("Something went wrong")
  }
})

GroupRouter.post("/join", Authorize, async (req, res) => {
  const { groupID } = req.body

  try {
    const groupId = await pool.query(
      "SELECT group_id FROM groups WHERE group_id = $1",
      [groupID]
    )

    if (groupId.rows.length < 0) {
      return res.status(404).json("Group doesn't exist")
    }

    const ifIn = await pool.query(
      "SELECT group_info_member = $1 FROM groups_info WHERE group_info_id = $2",
      [req.user.id, groupID]
    )

    console.log(ifIn)

    if (ifIn.rows.length > 0) {
      return res.status(404).json("You are already in this group")
    }

    await pool.query(
      "INSERT INTO groups_info (group_info_id, group_info_member) VALUES ($1, $2) RETURNING *",
      [groupID, req.user.id]
    )

    return res.status(200).json("Joined successfully")
  } catch (error) {
    console.error(error)
  }
})

GroupRouter.get("/exist/:id", Authorize, async (req, res) => {
  const { id } = req.params

  try {
    const groupId = await pool.query(
      "SELECT group_id FROM groups WHERE group_id = $1",
      [id]
    )
    if (groupId.rows.length > 0) {
      res.status(200).json(true)
    }
  } catch (error) {
    res.status(404).json(false)
  }
})

/*
CREATE TABLE groups_info(
  group_info_id                 VARCHAR(255) NOT NULL,
  group_info_member             INT NOT NULL
);

CREATE TABLE groups(
  group_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  group_admin_id INT NOT NULL, 
  group_name VARCHAR(255) NOT NULL, 
  group_about VARCHAR(255) NOT NULL,
  group_profile_image VARCHAR(255),
  group_members INT[],
  group_created_at VARCHAR(255) NOT NULL
);
*/
export default GroupRouter
