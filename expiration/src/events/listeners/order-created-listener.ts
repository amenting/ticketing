import { Listener, OrderCreatedEvent, Subjects } from "@amenting-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import { expirationQueue } from "../../queues/expiration-queues";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: 10
        });
        msg.ack();
    };
    
}