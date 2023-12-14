'use strict';

const WebSocket = require('ws');

class WebSocketServer {
    constructor(port) {
        // @ts-ignore
        this.wss = new WebSocket.Server({ port: port });
        this.clients = new Set();

        this.wss.on('connection', (ws) => {
            this.clients.add(ws);

            ws.on('message', (message) => {
                console.log('received: %s', message);
            });

            ws.on('close', () => {
                console.log('disconnected')
                this.clients.delete(ws);
            });

            this.sendMessage(ws, `${new Date().toLocaleString()} 已连接`);
        });

        // 每隔一段时间清理断开的连接
        setInterval(() => this.cleanup(), 10000); // 10 seconds

        console.log(`WebSocketServer started on port ${port}`);
    }

    sendMessage(ws, message) {
        ws.send(message);
    }

    broadcastMessage(message) {
        for (const client of this.clients) {
            this.sendMessage(client, message);
        }
    }

    cleanup() {
        for (const client of this.clients) {
            if (client.readyState !== WebSocket.OPEN) {
                console.log('清理断开链接client')
                this.clients.delete(client);
            }
        }
    }
}

module.exports = WebSocketServer;