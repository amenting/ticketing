import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';
import { OrderStatus } from '@amenting-tickets/common';

it('returns a 404 if the order is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .delete(`/api/orders/${id}`)
        .set('Cookie', global.signin())
        .send();
    expect(response.status).toEqual(404);
});

it('returns a 401 if the user is trying to get another users order', async () => {
    const ticket = Ticket.build({
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
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});

it('cancels the order', async () => {
    const ticket = Ticket.build({
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

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(204);

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
    expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an order cancelled event');