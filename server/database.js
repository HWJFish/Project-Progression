const {MongoClient}=require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const client=new MongoClient(MONGO_URI,options);
let db=null;
const connectDb=async()=>{
    await client.connect();
    try{
        db=client.db('Progression');
        return db;
    }catch(error){
        console.log('Cannot Connect to the database',error);
    }
}
const getDb=()=>{
    return db;
}

module.exports={
    connectDb,
    getDb
}