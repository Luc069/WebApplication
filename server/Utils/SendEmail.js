import nodemailer from "nodemailer"
import { config } from "../Config/config.js"

const SendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.user,
      pass: config.password,
    },
  })

  const mailOptions = {
    from: config.from,
    to: options.to,
    subject: options.subject,
    html: options.text,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log(info)
    }
  })
}

export default SendEmail
