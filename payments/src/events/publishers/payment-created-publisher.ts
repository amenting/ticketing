import { PaymentCreatedEvent, Publisher, Subjects } from "@amenting-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}