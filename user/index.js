const express = require("express")
const path = require("path")
const app = express()
const cookieParser = require('cookie-parser')
require("dotenv").config()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "client"))
app.use(express.static(path.join(__dirname, "./client")));
app.use(express.static(path.join(__dirname, "./client/js")));
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: "50000"
}));
app.use(cookieParser())
const messageTemplate = require("./util/messageTemplate")
const validator = require("./middlewares/auth.js")
const port = process.env.port || 2500;
app.get("/", validator.sessionChecker, async(req, res) => {
    return res.status(200).send("Main Page of voting...")
})

app.get("/signIn", validator.isSignedOut, async(req, res) => {
    return res.status(200).render('Loginpage.ejs')
})
app.post("/signIn", validator.validateAadhaarNumber, validator.validateMobileNumber, async(req, res) => {
    console.log(req.body)
    const template = messageTemplate.getTemplate();
    template.error = false;
    template.status = 200;
    template.message = 'Sign in sucessfull'
        //Have to first create dummy database for user details which will be added at admin port
        //If registered mob.no exist the verify using otp through  //https://instantalerts.co/api/web/send?apikey=xxxx&sender=&to=91xxxxxxxxxx&message=Otp
    return res.status(200).json(template)
})
app.listen(port, (err) => {
    if (!err)
        console.log(`server listening at port no: ${port}   ......`)
    else
        throw err
})