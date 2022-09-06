const { connectDb, getDb } = require('./database');


const sendResponse = (res, status, data, message) => {
    console.log(message)//debug only 
    res.status(status).json({ status, data, message });
}

const verifyKey = async(res, id, tempKey) => {
    if(!id||!tempKey){
        sendResponse(res, 400, null, "Missing-Data");
        return false;
    }
    const db = getDb();
    const user = await db.collection('users').findOne({ id });
    if (!user) {
        sendResponse(res, 404, null, 'User-not-found');
        return false;
    }
    if (!user.accessKey.includes(tempKey)) {
        sendResponse(res, 400, null, 'Invalid-access-key');
        return false;
    }
    return true;
}


module.exports = { sendResponse,verifyKey }