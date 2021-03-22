import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../model/order';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';

const createOrder = async (userId: string) => {
    const ticket = Ticket.build({
        title: 'test ticket',
        price: 1
    });
    await ticket.save();
    const order = Order.build({
        userId,
        ticket,
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();
    return order;
};

it('can fetch a list of tickets', async () => {
    const userId1 = mongoose.Types.ObjectId().toHexString();
    const userId2 = mongoose.Types.ObjectId().toHexString();
    await createOrder(userId1);
    await createOrder(userId1);
    await createOrder(userId1);
    await createOrder(userId2);
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', global.signin(userId1))
        .send()
        .expect(200);
    
    expect(response.body.length).toEqual(3);
});