"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const local_auth_1 = require("@google-cloud/local-auth");
const promises_1 = __importDefault(require("fs/promises"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const TOKEN_PATH = path_1.default.join(process_1.default.cwd(), 'token.json');
const CREDENTIALS_PATH = path_1.default.join(process_1.default.cwd(), 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.compose', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.labels'];
const loadSavedCredentialsIfExist = async () => {
    try {
        const content = await promises_1.default.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content.toString());
        return googleapis_1.google.auth.fromJSON(credentials);
    }
    catch (err) {
        return null;
    }
};
const saveCredentials = async (client) => {
    try {
        const content = await promises_1.default.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content.toString());
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await promises_1.default.writeFile(TOKEN_PATH, payload);
    }
    catch (error) {
        console.log(error);
    }
};
const authorize = async () => {
    try {
        console.log('checking auth...');
        let client = await loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await (0, local_auth_1.authenticate)({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
        return client;
    }
    catch (error) {
        console.log(error);
    }
};
exports.authorize = authorize;
