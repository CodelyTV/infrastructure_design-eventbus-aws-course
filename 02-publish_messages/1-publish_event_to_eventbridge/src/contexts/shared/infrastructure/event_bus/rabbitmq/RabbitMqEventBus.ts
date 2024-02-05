import { DomainEvent } from "../../../domain/event/DomainEvent";
import { EventBus } from "../../../domain/event/EventBus";
import { DomainEventJsonSerializer } from "../DomainEventJsonSerializer";
import { RabbitMqConnection } from "./RabbitMqConnection";

export class RabbitMqEventBus implements EventBus {
	constructor(private readonly connection: RabbitMqConnection) {}

	async publish(events: DomainEvent[]): Promise<void> {
		const promises = events.map((event) => {
			const routingKey = event.eventName;
			const content = Buffer.from(DomainEventJsonSerializer.serialize(event));

			return this.connection.publish("domain_events", routingKey, content, {
				messageId: event.eventId,
				contentType: "application/json",
				contentEncoding: "utf-8",
			});
		});

		await Promise.all(promises);
	}
}
