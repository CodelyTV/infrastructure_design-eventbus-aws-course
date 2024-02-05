import { v4 } from "uuid";

export abstract class DomainEvent {
	public readonly eventId: string;
	public readonly occurredOn: Date;

	protected constructor(
		public readonly eventName: string,
		public readonly aggregateId: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		this.eventId = eventId ?? v4();
		this.occurredOn = occurredOn ?? new Date();
	}

	abstract toPrimitives(): { [key: string]: unknown };
}
