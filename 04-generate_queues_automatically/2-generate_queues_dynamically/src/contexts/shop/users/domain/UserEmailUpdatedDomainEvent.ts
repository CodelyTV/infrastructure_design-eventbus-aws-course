import { DomainEvent } from "../../../shared/domain/event/DomainEvent";

export type UserEmailUpdatedDomainEventPrimitives = {
	id: string;
	email: string;
};

export class UserEmailUpdatedDomainEvent extends DomainEvent {
	static eventName = "user.email.updated";
	constructor(
		public readonly id: string,
		public readonly email: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(UserEmailUpdatedDomainEvent.eventName, id, eventId, occurredOn);
	}

	toPrimitives(): UserEmailUpdatedDomainEventPrimitives {
		return {
			id: this.id,
			email: this.email,
		};
	}
}
