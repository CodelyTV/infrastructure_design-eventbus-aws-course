import { UserDomainEvent } from "./UserDomainEvent";

export class UserRegisteredDomainEvent extends UserDomainEvent {
	static eventName = "codely.shop.user.registered";

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly email: string,
		public readonly profilePicture: string,
		public readonly status: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(UserRegisteredDomainEvent.eventName, id, eventId, occurredOn);
	}

	toPrimitives(): { [key: string]: unknown } {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			profilePicture: this.profilePicture,
			status: this.status,
		};
	}
}
