import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@amenting-tickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dtrtrzhrfhf',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 20,
        userId: mongoose.Types.ObjectId().toHexString()
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dtrtrzhrfhf',
            orderId: order.id
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        price: 20,
        userId: userId
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'dtrtrzhrfhf',
            orderId: order.id
        })
        .expect(400);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        price: 20,
        userId: userId
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'dtrtrzhrfhf',
            orderId: order.id
        })
        .expect(400);
});

it('returns a 201 with valid inputs', async() => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 20,
        userId: userId
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    /* testing with live api:
    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === order.price * 100;
    });
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');
    */
    
    expect(stripe.charges.create).toHaveBeenCalled();
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20*100);
    expect(chargeOptions.currency).toEqual('usd');
});

it('returns a 201 with valid inputs', async() => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 20,
        userId: userId
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);
    
    expect(stripe.charges.create).toHaveBeenCalled();

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20*100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: 'mockStripeId'
    });

    expect(payment).not.toBeNull();

});