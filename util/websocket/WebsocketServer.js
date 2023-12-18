'use strict';

const WebSocket = require('ws');
const EventEmitter = require('events');

class WebSocketServer extends EventEmitter {
    constructor(port) {
        super();
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

    // 广播消息(异步并发)
    async broadcastMessage(message) {
        // 获取所有客户端
        const sendPromises = Array.from(this.clients).map((client) => {
            return new Promise((resolve, reject) => {
                client.send(message, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("success");
                    }
                });
            });
        });

        // 并发发送消息
        await Promise.all(sendPromises);
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