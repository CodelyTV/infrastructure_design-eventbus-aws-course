import { DomainEvent } from "./DomainEvent";

export type DomainEventName<T extends DomainEvent> = Pick<T, "eventName">;
