import "reflect-metadata";

import {
	DeleteMessageCommand,
	Message,
	ReceiveMessageCommand,
	SQSClient,
} from "@aws-sdk/client-sqs";

import { DomainEvent } from "../../contexts/shared/domain/event/DomainEvent";
import { DomainEventClass } from "../../contexts/shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../contexts/shared/domain/event/DomainEventSubscriber";
import { container } from "../../contexts/shared/infrastructure/dependency_injection/diod.config";
import { DomainEventJsonDeserializer } from "../../contexts/shared/infrastructure/event_bus/DomainEventJsonDeserializer";

const subscribers = container
	.findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>("subscriber")
	.map((id) => container.get(id));

const eventMapping = new Map<string, DomainEventClass>();

subscribers.forEach((subscriber) => {
	subscriber.subscribedTo().forEach((eventClass) => {
		eventMapping.set(eventClass.eventName, eventClass);
	});
});

const deserializer = new DomainEventJsonDeserializer(eventMapping);

const sqsClient = new SQSClient({
	region: "us-east-1",
	endpoint: "http://127.0.0.1:4566",
});

async function main(): Promise<void> {
	await Promise.all(
		subscribers.flatMap((subscriber) => {
			const queueName = subscriber.name().replaceAll(".", "-");
			const queueUrl = `https://sqs.us-east-1.amazonaws.com/000000000000/${queueName}`;

			console.log(`Consuming from queue: ${queueUrl}`);

			return (async () => {
				const response = await sqsClient.send(
					new ReceiveMessageCommand({
						QueueUrl: queueUrl,
						MaxNumberOfMessages: 10,
					}),
				);

				if (response.Messages) {
					return Promise.all(
						response.Messages.map((message) => consume(message, subscriber, queueUrl)),
					);
				}

				return Promise.resolve();
			})();
		}),
	);
}

async function consume(
	message: Message,
	subscriber: DomainEventSubscriber<DomainEvent>,
	queueUrl: string,
) {
	const content = JSON.parse(message.Body as string);

	const domainEvent = deserializer.deserialize(JSON.stringify(content.detail));

	console.log(`Consuming event: ${domainEvent.eventName}`);

	try {
		await subscriber.on(domainEvent);

		await sqsClient.send(
			new DeleteMessageCommand({
				QueueUrl: queueUrl,
				ReceiptHandle: message.ReceiptHandle,
			}),
		);
	} catch (error) {
		console.log(`Error consuming ${content["detail-type"]}`, error);
	}
}

main().catch(console.error);
