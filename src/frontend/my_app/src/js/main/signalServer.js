const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('message', (message) => {
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

server.listen(8080, () => {
  console.log('WebSocket signaling server is running on ws://192.168.1.69:8080/startWsSession');
});