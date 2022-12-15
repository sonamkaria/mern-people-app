//Dependencies

// import mongoose
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")

//get .env variables
require("dotenv").config()

//pull port from .env, give default value of 3001
//destructuring method- we can add more variables if the exist in .env with this method
const {PORT , DATABASE_URL} = process.env

//Import express
const express = require("express")

//create application object
const app = express()



//Database connection
mongoose.connect(DATABASE_URL)

//connection
mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))

//model
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)

//middleware
app.use(cors()) //prevents crossed origin resource sharring errors, allows access to server from all origins i.e. react frontend
app.use(morgan("dev")) //logs details of all server hits to terminal
app.use(express.json()) // parse json bodies from request
app.use(express.urlencoded({extended:false})); //to use url encoded




/////Routes

//INDUCES

//create a test route
app.get("/", (req,res) => {
    res.send("hello world")
})

// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
    try {
      // send all people
      res.status(200).json(await People.find({}))
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  })

// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
    try {
      // send created person
      res.json(await People.create(req.body))
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  })

app.get("/people", (req,res)=>{
    res.send("/people -index route")
})

//create
app.post("/people", (req,res) => {
    res.send("/people - create route")
})

// PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
    try {
      // send deleted record
      res.json(await People.findByIdAndDelete(req.params.id))
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  })
  

//update
// PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req, res) => {
    try {
      // send updated person
      res.json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      )
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  })


//Listener
app.listen(PORT, () => console.log(`listening to smoothe sounds of ${PORT}`))
