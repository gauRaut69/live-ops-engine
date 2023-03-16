const express = require('express');
const mongoose = require('mongoose')
const bodyparse = require("body-parser");

const SERVER_PORT = process.env.PORT || 8080
const app = express();
const userRoutes = require('./routes/user')
const offerRoutes = require('./routes/offer')

mongoose.connect("mongodb+srv://graut69:nbssmlrs@liveops-cluster.nxorlqv.mongodb.net/test").then(()=> {
    console.log("Successfull connected to db")
}).catch(()=> {
    console.log("Failed to connect")
})
app.use(bodyparse.json());
app.listen(SERVER_PORT, ()=> {
    console.log("Server started at  " + "" + SERVER_PORT) 
})

app.use('/user', userRoutes);
app.use('/offer', offerRoutes);
