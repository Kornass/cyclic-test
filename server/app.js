const express = require('express'),
    app = express(),
    mongoose = require('mongoose') 
require("dotenv").config()
mongoose.set('debug',true)

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(require("cors")())

async function connecting(){
    try {

        await mongoose.connect(process.env.MONGO)
        console.log('Connected to the DB')
    } catch ( error ) {
        console.log('ERROR: Seems like your DB is not running, please start it up !!!');
    }
}
connecting()

app.listen(4000, () => console.log(`listening on port 4000`))