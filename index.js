import express from "express"
import dotenv from "dotenv"
import Connection from "./Database/db.js"
import Router from "./Routes/route.js"
import cors from "cors"
import bodyParser from "body-parser"
import user from "./model/PatientData.js"

user()

// Starting Express and Routing,Body Parser and Handling CORS

const app = express()
app.use(cors())
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use("/", Router)
// Configuring dotenv and getting values from it (.env file)

dotenv.config()
const PORT = process.env.PORT
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

// Establishing the Connection to the MongoDB ATlas Database
Connection(DB_USERNAME, DB_PASSWORD)









app.listen(PORT, () => {
    console.log(`Listening to the PORT ${PORT}`)
})