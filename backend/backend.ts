import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import path from 'path';

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('Neue WebSocket-Verbindung hergestellt.');

    ws.on('message', (message: string) => {
        console.log(`Nachricht erhalten: ${message}`);

        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('WebSocket-Verbindung geschlossen.');
    });
});

const publicPath = path.resolve(__dirname, '../frontend');

app.use(express.static(publicPath));

app.get('/', (req: any, res: any) => {
    res.sendFile(path.resolve(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(`HTTP-Server läuft auf Port ${PORT}`);
});
