import mongoose from 'mongoose';
import { app } from './app';
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

        await mongoose.connect(env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDb');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000...');
    })
};

start();
