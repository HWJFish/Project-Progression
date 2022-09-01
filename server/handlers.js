const { sendResponse } = require('./utils')

const axios = require('axios').default;
const { v4: uuidv4 } = require("uuid");
const { connectDb, getDb } = require("./database");

require("dotenv").config();
const { CLIENT_ID, CLIENT_SECRETS } = process.env;
const DEVICE_LIMIT=3;


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
                        'Accept': 'application/json' ,
                        "Authorization": `token ${tokenData.access_token}`
                    }
        })
        // find if current user is already in the database
        // create one or login with the key
        userResponse=userResponse.data;
        const tempKey=uuidv4();
        const user=await db.collection('users').findOne({id:userResponse.id});
        if(user){
            await db.collection('users').updateOne({id:userResponse.id},{
                $set:{token:tokenData.access_token,accessKey:[...user.accessKey.slice(-DEVICE_LIMIT+1),tempKey]}
            })
        }
        else{
            await db.collection('users').insertOne({
                ...userResponse,token:tokenData.access_token,accessKey:[tempKey],isPublic:false
            })
        }
        const clientResponse={
            login:userResponse.login,
            tempKey,
            url:userResponse.html_url,
            avatar_url:userResponse.avatar_url
        }
        sendResponse(res, 200,clientResponse, "success");
    } catch (error) {
        console.log(error);
    }
}



module.exports = { handleLogin }