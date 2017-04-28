const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
 
app.use(express.static('public'));
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, perMessageDeflate: false });
 
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
 
wss.on('connection', function(ws) {
    ws.on('message', function(msg) {
        data = JSON.parse(msg);
        if (data.message) wss.broadcast('<strong>' + data.name + '</strong>: ' + data.message);
    });
});
 
server.listen(process.env.PORT, function() {
    console.log('listening on ');
});