import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

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

    // monitoring:
    // kubectl get pods
    // kubectl port-forward my-special-pod 8222:8222
    //  http://localhost:8222/streaming/channelsz?subs=1

    new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());