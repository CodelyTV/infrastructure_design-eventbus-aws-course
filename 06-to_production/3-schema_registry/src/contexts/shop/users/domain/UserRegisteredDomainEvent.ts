import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";
import { UserDomainEvent } from "./UserDomainEvent";

export class UserRegisteredDomainEvent extends UserDomainEvent {
	static eventName = "codely.shop.user.registered";

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly email: string,
		public readonly profilePicture: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(UserRegisteredDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): UserRegisteredDomainEvent {
		return new UserRegisteredDomainEvent(
			aggregateId,
			attributes.name as string,
			attributes.email as string,
			attributes.profilePicture as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): DomainEventAttributes {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			profilePicture: this.profilePicture,
		};
	}
}
