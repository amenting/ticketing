import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';

it('returns a 404 if the order is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .get(`/api/orders/${id}`)
        .set('Cookie', global.signin())
        .send();
    expect(response.status).toEqual(404);
});

it('returns a 401 if the user is trying to get another users order', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'some',
        price: 29
    });
    await ticket.save();
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});

it('returns the order', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'some',
        price: 29
    });
    await ticket.save();
    const cookie = global.signin();
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});