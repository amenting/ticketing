import { Listener, NotFoundError, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from '@amenting-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price } = data;

        const ticket = await Ticket.findById(id);
        if(!ticket) {
            throw new NotFoundError();
        }
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }
}