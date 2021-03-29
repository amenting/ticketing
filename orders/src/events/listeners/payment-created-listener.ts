import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@amenting-tickets/common";
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from "../../model/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();

        //TODO emit order updated event
        // if there are ever any other changes to this entity

        msg.ack();
    }
}