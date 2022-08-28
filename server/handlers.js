const { sendResponse } = require('./utils')

//const axios = require('axios').default;
const fetch=require('node-fetch');
const FormData=require('form-data');
const { connectDb, getDb } = require("./database");

require("dotenv").config();
const { CLIENT_ID, CLIENT_SECRETS } = process.env;


const handleLogin = async (req, res) => {
    //console.log(CLIENT_ID,CLIENT_SECRETS);
    //get token from api
    const code = req.body.code;
    const db = getDb();
    if (!code) {
        return sendResponse(res, 400, null, "Missing-Code");
    }
    try {
        console.log(code)
        const data = new FormData();
        data.append("client_id", CLIENT_ID);
        data.append("client_secret", CLIENT_SECRETS);
        data.append("code", code);
        const response = await fetch(`https://github.com/login/oauth/access_token`, {
            method: "POST",
            body: data,
          });
        console.log(response);
        if (!response.access_token) {
            return sendResponse(res, 400, null, "Cannot-get-token-from-github");
        }
        db.users.insertOne({
            _id: response.access_token,
        })
        sendResponse(res, 200, null, "success");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { handleLogin }