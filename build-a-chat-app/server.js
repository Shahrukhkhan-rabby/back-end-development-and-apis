import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

// 1. Create HTTP server to serve public/index.html
const server = http.createServer((req, res) => {
    fs.readFile('./public/index.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// 2. Create WebSocketServer sharing the HTTP server port
const wss = new WebSocketServer({ server });

// 3. Register 'connection' listener on wss receiving (socket, req)
wss.on('connection', (socket, req) => {
    // 4. Parse connecting client's username from URL query string
    const username = new URL(req.url, "http://localhost").searchParams.get("username");

    // 5. Broadcast join message to all connected clients
    const joinMessage = JSON.stringify({ type: "system", text: `${username} joined` });
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(joinMessage);
        }
    });

    // 6. Register 'message' listener on socket
    socket.on('message', (data) => {
        try {
            const parsed = JSON.parse(data.toString());
            const chatMessage = JSON.stringify({
                type: 'chat',
                username: parsed.username || username,
                text: parsed.text
            });

            // Broadcast chat message to all connected clients (including sender)
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(chatMessage);
                }
            });
        } catch (err) {
            console.error("Failed to parse message:", err);
        }
    });

    // 7. Register 'close' listener on socket
    socket.on('close', () => {
        const leaveMessage = JSON.stringify({ type: 'system', text: `${username} left` });
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(leaveMessage);
            }
        });
    });
});

// 8. Start the server and log the required startup message
server.listen(PORT, () => {
    console.log(`Chat server running at http://localhost:${PORT}`);
});