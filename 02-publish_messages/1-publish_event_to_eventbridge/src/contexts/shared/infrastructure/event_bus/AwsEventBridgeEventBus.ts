import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

import { DomainEvent } from "../../domain/event/DomainEvent";
import { EventBus } from "../../domain/event/EventBus";
import { DomainEventJsonSerializer } from "./DomainEventJsonSerializer";

export class AwsEventBridgeEventBus implements EventBus {
	private readonly client = new EventBridgeClient({
		region: "us-east-1",
		endpoint: "http://127.0.0.1:4566",
	});

	private readonly eventBusName = "codely.domain_events";
	private readonly projectName = "codely";

	async publish(events: DomainEvent[]): Promise<void> {
		const promises = events.map((event) => {
			return this.client.send(
				new PutEventsCommand({
					Entries: [
						{
							EventBusName: this.eventBusName,
							Detail: DomainEventJsonSerializer.serialize(event),
							DetailType: event.eventName,
							Source: this.projectName,
						},
					],
				}),
			);
		});

		await Promise.all(promises);
	}
}
