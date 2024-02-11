const nodemailer = require("nodemailer")
require("dotenv").config()

const sendEmail = addr => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "gqpweb@gmail.com",
            pass: process.env.APP_PASSWORD,
        },
    })

    const mailOptions = {
        from: "Samy from GQP Web <gqpweb@gmail.com>",
        to: addr.replace("mailto:", "").replace(/\.com(.*)*/, ".com"),
        subject: "Hello from Nodemailer",
        text: "This is a test email sent using Nodemailer.",
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error)
        } else {
            console.log("Email sent: ", info.response)
        }
    })
}

export default sendEmail