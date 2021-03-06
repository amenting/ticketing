import { OrderCreatedEvent, Publisher, Subjects } from "@amenting-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}