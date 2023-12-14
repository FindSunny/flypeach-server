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
                this.ch.assertExchange('logs', 'fanout', { durable: false });
            });
        });
    }

    // 接受消息, callback为回调函数
    receiveMessage(callback) {
        this.ch.assertQueue('', { exclusive: true }, (err, q) => {
            if (err) {
                console.error(err);
                return;
            }
            this.ch.bindQueue(q.queue, 'logs', '');
            this.ch.consume(q.queue, (msg) => {
                if (msg.content) {
                    callback(msg.content.toString());
                }
            }, { noAck: true });
        });
    }
}

module.exports = RabbitMQUtils;