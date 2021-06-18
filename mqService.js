const amqp = require('amqplib');
const config = require('config');
const mqConfig = config.get('mq');

class RabbitMQ {
    constructor(wind) {
        this.connection = null;
        this.channel = null;
        this.queue = null;
        this.window = wind;
    }

    async init() {
        try {
            this.connection = await amqp.connect(mqConfig);
            this.channel = await this.connection.createChannel();
            
            this.queue = await this.channel.assertQueue('', {
                durable: false,
                autoDelete: true
            });

            this.channel.bindQueue(this.queue.queue, mqConfig.server.exchange, '');

            
            this.channel.consume(this.queue.queue, (msg) => {
                this.window.webContents.send('NEW_MQ_MESSAGE', msg.content.toString());
            });
        } catch(error) {
            console.log(error);
        }
    }

    async sendMessage(data) {
        if (!this.connection) {
            await this.init();
        }

        this.channel.sendToQueue(mqConfig.client.queue, Buffer.from(JSON.stringify(data)), { persistent: true });
    }

    async connsumeMessage() {
        // this.channel.consume()
    }



    
    // _handleMessage(msg) {
    //     switch (msg.type) {
    //         case 'register':
    //             //game status == aguardando inicio
    //             if(true) {
    //                 //registra
    //             }else if(true) {
    //                 //verifica se é um reconect
    //             }else {
    //                 //ignora msg e apaga da fila
    //             }
    
    //             break;
    //         case 'move':
    //             break;
    //     }
    // } 
}

module.exports = RabbitMQ;