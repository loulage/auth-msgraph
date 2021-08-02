const express = require("express");
const msal = require('@azure/msal-node');
const fetch = require('./fetch');

const SERVER_PORT = process.env.PORT || 3000;
const REDIRECT_URI = "http://localhost:3000/redirect";

const config = {
    auth: {
        clientId: "dc08899a-b38b-4c91-8bc5-090a6dff151b",
        authority: "https://login.microsoftonline.com/common",
        clientSecret: "mEV_8_o_EV4~43KgNf_h6Ygfw9tzTPZW35"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                // console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Create msal application object
const pca = new msal.ConfidentialClientApplication(config);

// Create Express App and Routes
const app = express();

app.get('/', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
    };

    // get url to sign user in and consent to scopes needed for application
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        // console.log(`AQUI JAZ ACCESSTOKEN`, response)
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
    };

    pca.acquireTokenByCode(tokenRequest).then(async (response) => {
        //console.log("\nResponse: \n:", response);
        // const users = fetch.callApi(auth.apiConfig.uri, authResponse.accessToken);
        console.log(`AQUI JAZ ACCESSTOKEN`, response.accessToken)
        
        const testao = await fetch.callApi(response.accessToken)
        console.log(testao)
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});


app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))
