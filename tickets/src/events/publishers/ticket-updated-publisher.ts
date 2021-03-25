import { Publisher, Subjects, TicketUpdatedEvent } from "@amenting-tickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
