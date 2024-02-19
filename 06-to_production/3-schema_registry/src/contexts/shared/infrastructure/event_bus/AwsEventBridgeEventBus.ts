import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { Service } from "diod";

import { DomainEvent } from "../../domain/event/DomainEvent";
import { EventBus } from "../../domain/event/EventBus";
import { DomainEventJsonSerializer } from "./DomainEventJsonSerializer";
import { DomainEventFailover } from "./failover/DomainEventFailover";

@Service()
export class AwsEventBridgeEventBus implements EventBus {
	private readonly client = new EventBridgeClient({
		region: "us-east-1",
	});

	private readonly eventBusName = "codely.domain_events";
	private readonly projectName = "codely";

	constructor(private readonly failover: DomainEventFailover) {}

	async publish(events: DomainEvent[]): Promise<void> {
		const promises = events.map(async (event) => {
			const serializedEvent = DomainEventJsonSerializer.serialize(event);

			await this.publishRaw(event.eventId, event.eventName, serializedEvent);
		});

		await Promise.all(promises);
	}

	async publishFromFailover(): Promise<void> {
		const events = await this.failover.consume(10);

		await Promise.all(
			events.map((event) => this.publishRaw(event.eventId, event.eventName, event.body)),
		);
	}

	private async publishRaw(eventId: string, eventName: string, serializedEvent: string) {
		try {
			console.log("PUBLISHING");

			return await this.client.send(
				new PutEventsCommand({
					Entries: [
						{
							EventBusName: this.eventBusName,
							Detail: serializedEvent,
							DetailType: eventName,
							Source: this.projectName,
						},
					],
				}),
			);
		} catch (error: unknown) {
			console.log(error);
			console.log("---------------------------------------------");

			return this.failover.publish(eventId, eventName, serializedEvent);
		}
	}
}
