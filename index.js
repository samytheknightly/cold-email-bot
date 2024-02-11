const fs = require("fs")
const sendEmail = require("./send")
const getLeads = require("./leads")

getLeads()

const emails = fs.readFileSync("emails.txt", "utf8").split("\n")

emails.forEach(email => {
    sendEmail(email)
})