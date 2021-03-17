import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log(`Listener connected to NATS - clientId: ${clientId}`);

    const subscription = stan.subscribe('ticket:created');

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }
    });
});