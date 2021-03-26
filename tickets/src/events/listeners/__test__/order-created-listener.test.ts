import { OrderCreatedEvent, OrderStatus } from "@amenting-tickets/common";
import { Ticket } from "../../../model/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf'
    });
    await ticket.save();

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'ERtgez336',
        ticket: {
            id: ticket.id,
            price: 20
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
}

it('locks the ticket by setting the orderId', async () => {
    const  { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const  { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});



