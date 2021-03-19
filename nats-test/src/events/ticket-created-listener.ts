import { Listener, Subjects, TicketCreatedEvent } from '@amenting-tickets/common';
import { Message } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage = (data: TicketCreatedEvent['data'], msg: Message) => {
        console.log('Event data!', data);

        console.log(data.id);
        
        msg.ack();
    }
}