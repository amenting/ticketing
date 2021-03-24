import { OrderCancelledEvent, Publisher, Subjects } from "@amenting-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}