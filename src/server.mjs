import express from 'express';
import * as http from "http";
import StompServer from "stomp-broker-js";

import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use('/', express.static(__dirname + '/static'));
app.get('/health', (req, res) => res.send('OK'));
let server = http.createServer({}, app);
const stompServer = new StompServer({server, path: "/ws"});
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

const tokens = {};
app.post('/token', (req, res) => {
    const token = Math.random();
    tokens[token] = new Date();
    res.send("" + token);
});

const TOKEN_TIMEOUT = 1 * 60 * 1000; //1 min
/*
Add in stompServer.js new line
this.socket.on('connection', function (ws, incomingMessage) {  //new param incomingMessage
    ws.__req = incomingMessage;  //new line
*/
stompServer.addMiddleware("connect", function (socket, args, callNext) {
    console.log("connect");
    const token = socket.__req.url.split("?token=")[1];
    if (tokens[token]) {
        if (((new Date()).getTime() - tokens[token].getTime()) < TOKEN_TIMEOUT) {
            return callNext();
        }
    }
    console.log("token failed");
    return false;
});

//works only /**; topic/** not works
stompServer.subscribe("/**", (msg, headers) => {
    const topic = headers.destination;
    console.log(`Topic = ${topic} -> message: ${msg}`);
    setTimeout(() => stompServer.send(topic, {}, 'echo: ' + msg), 1000);
});
