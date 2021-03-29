import { ExpirationCompleteEvent, Publisher, Subjects } from "@amenting-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}