import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log(`Listener connected to NATS - clientId: ${clientId}`);

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    const options = stan.subscriptionOptions()
        .setManualAckMode(true);
    // monitoring:
    // kubectl get pods
    // kubectl port-forward my-special-pod 8222:8222
    //  http://localhost:8222/streaming/channelsz?subs=1
    const subscription = stan.subscribe(
        'ticket:created',
        'orders-service-queue-group',
        options
    );

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }

        msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
