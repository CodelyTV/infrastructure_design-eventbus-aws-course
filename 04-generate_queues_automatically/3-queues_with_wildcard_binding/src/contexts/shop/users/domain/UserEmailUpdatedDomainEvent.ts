import { UserDomainEvent } from "./UserDomainEvent";

export type UserEmailUpdatedDomainEventPrimitives = {
	id: string;
	email: string;
};

export class UserEmailUpdatedDomainEvent extends UserDomainEvent {
	static eventName = "codely.shop.user.email.updated";

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
