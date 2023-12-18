'use strict';

class RabbitMQUtils {
    constructor() {
        this.amqp = require('amqplib/callback_api');
        this.amqp.connect('amqp://localhost', (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            this.conn = conn;
            this.conn.createChannel((err, ch) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.ch = ch;
                // 直连队列
                this.ch.assertQueue('news', { durable: false });
            });
        });
    }

    // 接受消息, callback为回调函数
    receiveMessage(callback) {
        // 判断是否链接
        if (!this.conn) {
            setTimeout(() => this.receiveMessage(callback), 1000);
            return;
        }

        this.ch.consume('news', (msg) => {
            if (msg !== null) {
                callback(msg.content.toString());
                this.ch.ack(msg);
            }
        });

        console.log('RabbitMQUtils receiveMessage');
    }


}

module.exports = RabbitMQUtils;