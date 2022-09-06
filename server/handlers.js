const { sendResponse,verifyKey } = require('./utils')

const axios = require('axios').default;
const { v4: uuidv4 } = require("uuid");
const { connectDb, getDb } = require("./database");

require("dotenv").config();
const { CLIENT_ID, CLIENT_SECRETS } = process.env;
const DEVICE_LIMIT = 3;


const handleLogin = async (req, res) => {

    //get token from api
    const code = req.body.code;
    const db = getDb();
    if (!code) {

        return sendResponse(res, 400, null, "Missing-Code");
    }
    try {


        //get accessToken by github
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token',
            data: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRETS,
                code: code
            },
            headers: { 'Accept': 'application/json' }
        })

        const tokenData = tokenResponse.data;

        if (!tokenData.access_token) {
            //console.log(code,tokenData)
            return sendResponse(res, 400, null, "Cannot-get-token-from-github");
        }
        //get userInfo by token
        let userResponse = await axios({
            method: 'get',
            url: 'https://api.github.com/user',
            data: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRETS,
                code: code
            },
            headers: {
                'Accept': 'application/json',
                "Authorization": `token ${tokenData.access_token}`
            }
        })
        // find if current user is already in the database
        // create one or login with the key
        userResponse = userResponse.data;
        const tempKey = uuidv4();
        const user = await db.collection('users').findOne({ id: userResponse.id });
        if (user) {
            await db.collection('users').updateOne({ id: userResponse.id }, {
                $set: { token: tokenData.access_token, accessKey: [...user.accessKey.slice(-DEVICE_LIMIT + 1), tempKey] }
            })
        }
        else {
            await db.collection('users').insertOne({
                ...userResponse, token: tokenData.access_token, accessKey: [tempKey], isPublic: false
            })
        }
        const clientResponse = {
            login: userResponse.login,
            tempKey,
            id: userResponse.id,
            url: userResponse.html_url,
            avatar_url: userResponse.avatar_url
        }
        sendResponse(res, 200, clientResponse, "success");
    } catch (error) {
        //console.log(error);
        sendResponse(res, 500, null, "Unknown-Error");
    }
}

const addProgress = async (req, res) => {
    const { task, id, tempKey } = req.body;
    if (!task ) {
        return sendResponse(res, 400, null, "Missing-Data");
    }
    const db = getDb();
    try {
        const verifyResult=await verifyKey(res,id,tempKey);
        if(!verifyResult){
            return;
        }
        const result =await db.collection('tasks').insertOne(task);

        sendResponse(res, 200,{...task,_id:result.insertedId}, "success");
    }catch (error) {
        //console.log(error);
        sendResponse(res, 500, null, "Unknown-Error");
    }
}
const getProgress=async(req,res)=>{
    const LIMIT=10;
    let {start,tag,id,tempKey}=req.body;
    if(!start){
        start=1;
    }
    try{
        const db=getDb();
        const verifyResult=await verifyKey(res,id,tempKey);
        if(!verifyResult){
            return;
        }
        const query={userId:id};
        if(tag){
            query.tags=tag;
        }
        const result=await db.collection('tasks')
            .find(query)
            .sort({startTime:-1})
            .skip(start-1)
            .limit(LIMIT)
            .toArray();
        if(result){
            sendResponse(res,200,result,'Success');
        }else{
            sendResponse(res,404,result,'Record-not-found');
        }

    }catch(error){
        console.log(error)
        sendResponse(res,500,null,'Unknown-Error');
    }


}
const getDailyTask =async(req,res)=>{
    const LIMIT=10;
    let {start,id,tempKey}=req.body;
    if(!start){
        start=1;
    }
    try{
        const db=getDb();
        const verifyResult=await verifyKey(res,id,tempKey);
        if(!verifyResult){
            return;
        }
        const query={userId:id};
        
        const result=await db.collection('dailyTask')
            .find(query)
            .skip(start-1)
            .limit(LIMIT)
            .toArray();
        if(result){
            sendResponse(res,200,result,'Success');
        }else{
            sendResponse(res,404,result,'Record-not-found');
        }

    }catch(error){
        console.log(error)
        sendResponse(res,500,null,'Unknown-Error');
    }
}

const postDailyTask =async(req,res)=>{
    const LIMIT=10;
    let {start,id,tempKey,task}=req.body;
    if(!start){
        start=1;
    }
    try{
        const db=getDb();
        const verifyResult=await verifyKey(res,id,tempKey);
        if(!verifyResult){
            return;
        }
        
        const result=await db.collection('dailyTask')
            .insertOne({task,userId:id});
        const query={userId:id};
        const newResult=await db.collection('dailyTask')
            .find(query)
            .skip(start-1)
            .limit(LIMIT)
            .toArray();
        if(newResult){
            sendResponse(res,200,newResult,'Success');
        }else{
            sendResponse(res,404,newResult,'Record-not-found');
        }

    }catch(error){
        console.log(error)
        sendResponse(res,500,null,'Unknown-Error');
    }
}



module.exports = { handleLogin, addProgress,getProgress,getDailyTask ,postDailyTask}