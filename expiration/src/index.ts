import { natsWrapper} from './nats-wrapper';

const start = async () => {
    const env = process.env;
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
    } catch (err) {
        console.error(err);
    }

};

start();
