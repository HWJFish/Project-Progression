const { connectDb, getDb } = require('./database');


const sendResponse=(res,status,data,message)=>{
    console.log(message)//debug only 
    res.status(status).json({status,data,message});
}


module.exports={sendResponse}