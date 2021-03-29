import { ExpirationCompleteEvent, Listener, NotFoundError, OrderStatus, Subjects } from "@amenting-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-event";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId)
            .populate('ticket');
        
        if(!order) {
            throw new Error('Order not found');
        }
        
        if(order.status != OrderStatus.Complete) {
            msg.ack();
        }
        
        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}