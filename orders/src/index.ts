import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper} from './nats-wrapper';

const start = async () => {
    const env = process.env;
    if(!env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined. '+
            'Try: kubectl create secret generic jwt-secret --from-literal=JWT_KEY=somekey');
    }
    if(!env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined. '+
            'Try: adding it to the env section of k8s.');
    }
    if(!env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if(!env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    if(!env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    try {
        // connect NATS
        await natsWrapper.connect(
            env.NATS_CLUSTER_ID,
            env.NATS_CLIENT_ID,
            env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // connect MongoDB
        await mongoose.connect(env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDb');

        // start listening to events
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000...');
    })
};

start();
