'use strict';

const WebSocketServer = require('./util/websocket/WebsocketServer');
const RabbitMQUtils = require('./util/rabbitmq/RabbitMQUtils');

const wss = new WebSocketServer(8080);
const rabbitmq = new RabbitMQUtils();

// 发送接收到的消息到所有客户端
rabbitmq.receiveMessage((message) => {
    console.log(`received: ${message}`);
    wss.broadcastMessage(message);
});

