const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const express = require('express');
const http = require('http');

const PORT = 3001;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello!');
});

const server = http.createServer(app);
const wss = new SocketServer({ server });

wss.broadcast = data => {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', data => {
    console.log(`Got message from the client ${data}`);
    wss.broadcast(data);
  });

  ws.send('hello!');
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
