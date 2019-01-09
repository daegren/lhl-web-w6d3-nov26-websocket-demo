const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const express = require('express');
const http = require('http');
const uuid = require('uuid/v4');

const PORT = 3001;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello!');
});

const server = http.createServer(app);
const wss = new SocketServer({ server });

const messageDatabase = [];

wss.broadcastJSON = obj => wss.broadcast(JSON.stringify(obj));

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
    const objData = JSON.parse(data);

    switch (objData.type) {
      case 'text-message':
        const objectToBroadcast = {
          id: uuid(),
          date: new Date(),
          content: objData.content,
          type: 'text-message'
        };
        messageDatabase.push(objectToBroadcast);
        wss.broadcastJSON(objectToBroadcast);
        break;
      default:
    }
  });

  const initialMessage = {
    type: 'initial-messages',
    messages: messageDatabase
  };
  ws.send(JSON.stringify(initialMessage));
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
