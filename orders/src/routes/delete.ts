import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@amenting-tickets/common';
import express, {Request, Response} from 'express';
import { Order } from '../model/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-event';

const router = express.Router();

router.delete('/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order
            .findById(req.params.orderId)
            .populate('ticket');
        if(!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled;
        await order.save();
        res.status(204).send(order);
    
        // publish an event
        new OrderCancelledPublisher(natsWrapper.client)
            .publish({
                id: order.id,
                ticket: {
                    id: order.ticket.id
                }
            });
});

export { router as deleteOrderRouter }