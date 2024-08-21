const amqp = require('amqplib');
require('dotenv').config();
const login = require('./login')

async function sendToQueue(req,res,next) {
  const message = {
    email: req.body.email,
    responseQueue: 'response_queue_' + Math.random().toString(36).substring(7),
  };

  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'login_queue';

  await channel.assertQueue(queue, { durable: false });
  await channel.assertQueue(message.responseQueue, { durable: false });

  console.log('Before sending to queue');
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  setTimeout(() => {
    connection.close();
    return next()
  }, 500);  
}
  
  module.exports = { sendToQueue };
  