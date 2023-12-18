'use strict';

const WebSocketServer = require('./util/websocket/WebsocketServer');
const RabbitMQUtils = require('./util/rabbitmq/RabbitMQUtils');

const wss = new WebSocketServer(8080);
const rabbitmq = new RabbitMQUtils();

// 监听消息
wss.on('message', async (message) => {
    console.log(`received: ${message}`);
    // 异步广播消息
    await wss.broadcastMessage(message);
});


// 发送接收到的消息到所有客户端
rabbitmq.receiveMessage((message) => {
    console.log(`received: ${message}`);
    // 触发message事件
    wss.emit('message', message);
});

