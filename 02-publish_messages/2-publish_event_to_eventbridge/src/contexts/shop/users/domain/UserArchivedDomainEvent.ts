import { DomainEvent } from "../../../shared/domain/event/DomainEvent";

export class UserArchivedDomainEvent extends DomainEvent {
	static eventName = "user.archived";

	constructor(
		public readonly id: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(UserArchivedDomainEvent.eventName, id, eventId, occurredOn);
	}

	toPrimitives(): { [key: string]: unknown } {
		return {
			id: this.id,
		};
	}
}
