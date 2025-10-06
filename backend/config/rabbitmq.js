const amqp = require('amqplib');
const logger = require('../utils/logger');

let connection;
let channel;

async function connectRabbitMQ() {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
    
    connection = await amqp.connect(rabbitmqUrl);
    logger.info('RabbitMQ connection established');

    channel = await connection.createChannel();
    logger.info('RabbitMQ channel created');

    // Declare queues
    await channel.assertQueue('user.created', { durable: true });
    await channel.assertQueue('user.deleted', { durable: true });
    await channel.assertQueue('user.updated', { durable: true });

    // Set up error handling
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed');
    });

    channel.on('error', (err) => {
      logger.error('RabbitMQ channel error:', err);
    });

    return { connection, channel };
  } catch (error) {
    logger.error('RabbitMQ connection failed:', error);
    throw error;
  }
}

async function publishMessage(queue, message) {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not available');
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    const published = channel.sendToQueue(queue, messageBuffer, {
      persistent: true,
      timestamp: Date.now()
    });

    if (published) {
      logger.info(`Message published to queue ${queue}:`, message);
    } else {
      logger.warn(`Failed to publish message to queue ${queue}`);
    }

    return published;
  } catch (error) {
    logger.error('Failed to publish message:', error);
    throw error;
  }
}

async function consumeMessages(queue, callback) {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not available');
    }

    await channel.consume(queue, (msg) => {
      if (msg) {
        try {
          const message = JSON.parse(msg.content.toString());
          logger.info(`Received message from queue ${queue}:`, message);
          callback(message);
          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing message:', error);
          channel.nack(msg, false, false);
        }
      }
    });

    logger.info(`Started consuming messages from queue ${queue}`);
  } catch (error) {
    logger.error('Failed to consume messages:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  try {
    if (channel) {
      await channel.close();
      logger.info('RabbitMQ channel closed');
    }
    if (connection) {
      await connection.close();
      logger.info('RabbitMQ connection closed');
    }
  } catch (error) {
    logger.error('Error closing RabbitMQ connections:', error);
  }
});

module.exports = {
  connectRabbitMQ,
  publishMessage,
  consumeMessages,
  getChannel: () => channel,
  getConnection: () => connection
};
