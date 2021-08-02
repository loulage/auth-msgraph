const axios = require('axios');


async function callApi(accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json' 
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.get('https://graph.microsoft.com/v1.0/me/drive/root/children', options);
        return response.data;
    } catch (error) {
        console.log(error)
        return error;
    }
};

module.exports = {
    callApi: callApi
};