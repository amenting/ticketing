import { Listener, TicketCreatedEvent, TicketUpdatedEvent } from "@amenting-tickets/common";
import { Mongoose } from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../model/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 5
    })
    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'changed concert',
        price: 20,
        userId: mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    
    return { listener, ticket, data, msg };
};

it('finds, updates and saves a ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure a ticket was created!
    const changedTicket = await Ticket.findById(ticket.id);

    expect(changedTicket).toBeDefined();
    expect(changedTicket!.version).toEqual(data.version);
    expect(changedTicket!.title).toEqual(data.title);
    expect(changedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    // call the onMaessage function with the data object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure ack function is called
    expect(msg.ack).toBeCalled();
});

it('rejects an out of order (non-sequence-version) event', async () => {
    const { listener, ticket, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    data.version+=10;
    try {
        await listener.onMessage(data, msg);
    } catch(err) {

    }
    // write assertions to make sure the ack function was not called.
    expect(msg.ack).not.toHaveBeenCalled();
});