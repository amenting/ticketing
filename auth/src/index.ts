import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    console.log('Starting up......');
    
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined. '+
            'Try: kubectl create secret generic jwt-secret --from-literal=JWT_KEY=somekey');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined. '+
            'Try: adding it to the env section of k8s.');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
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
