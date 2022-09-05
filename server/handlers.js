const { sendResponse } = require('./utils')

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
    if (!task || !id || !tempKey) {
        return sendResponse(res, 400, null, "Missing-Data");
    }
    const db = getDb();
    try {
        const user = await db.collection('users').findOne({ id });
        if (!user) {
            return sendResponse(res, 404, null, 'User-not-found');
        }
        if(!user.accessKey.includes(tempKey)){
            return sendResponse(res, 400, null, 'Invalid-access-key');
        }
        const result =await db.collection('tasks').insertOne(task);

        sendResponse(res, 200,{...task,_id:result.insertedId}, "success");
    }catch (error) {
        //console.log(error);
        sendResponse(res, 500, null, "Unknown-Error");
    }
}



module.exports = { handleLogin, addProgress }