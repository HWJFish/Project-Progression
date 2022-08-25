"use strict";

const express =require("express");
const morgan = require("morgan");
const {connectDb,getDb} =require("./database");

const app=express();
//const path = require('path')

const PORT=8004;

const startServer=async ()=>{
    await connectDb();
    // const db= getDb();
    // db.collection("test").insertOne({test:'test'});
    app.use(morgan("tiny"))
        .use(express.json())
        //.use('/static', express.static(path.join(__dirname, 'public')));

    app.get("/test",(req,res)=>{res.status(200).json({status:200,message:"test"})});
    
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

startServer();
