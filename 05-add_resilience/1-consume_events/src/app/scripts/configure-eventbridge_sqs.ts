import "reflect-metadata";

import {
	CreateEventBusCommand,
	EventBridgeClient,
	PutRuleCommand,
	PutTargetsCommand,
} from "@aws-sdk/client-eventbridge";
import { CreateQueueCommand, SQSClient } from "@aws-sdk/client-sqs";

import { DomainEvent } from "../../contexts/shared/domain/event/DomainEvent";
import { DomainEventSubscriber } from "../../contexts/shared/domain/event/DomainEventSubscriber";
import { container } from "../../contexts/shared/infrastructure/dependency_injection/diod.config";

type QueueConfig = {
	name: string;
	rulePattern: string[];
};

type RuleConfig = {
	name: string;
	eventBusName: string;
	rulePattern: string;
};

type TargetConfig = {
	eventBusName: string;
	ruleName: string;
	queueName: string[];
};

const eventBridgeClient = new EventBridgeClient({
	region: "us-east-1",
	endpoint: "http://127.0.0.1:4566",
});

const sqsClient = new SQSClient({
	region: "us-east-1",
	endpoint: "http://127.0.0.1:4566",
});

const subscribers = container
	.findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>("subscriber")
	.map((id) => container.get(id));

const queues: QueueConfig[] = subscribers.map((subscriber) => ({
	name: subscriber.name().replaceAll(".", "-"),
	rulePattern: subscriber.subscribedTo().map((event) => event.eventName),
}));

async function main(): Promise<void> {
	const eventBusName = "codely.domain_events";

	await createEventBus(eventBusName);

	await Promise.all(extractRulesFromQueues(queues, eventBusName).map(createRule));

	await Promise.all(queues.map(createQueue));

	await Promise.all(extractTargetsFromQueues(queues, eventBusName).map(createTarget));
}

async function createEventBus(name: string): Promise<void> {
	await eventBridgeClient.send(new CreateEventBusCommand({ Name: name }));
}

async function createRule(rule: RuleConfig): Promise<void> {
	const eventPattern = rule.rulePattern.includes("*")
		? // ? `{"detail-type": [{"wildcard": "${rule.rulePattern}"}]}` // no en localstack
		  `{"detail-type": [{"prefix": "${rule.rulePattern.replace("*", "")}"}]}`
		: `{"detail-type": ["${rule.rulePattern}"]}`;

	await eventBridgeClient.send(
		new PutRuleCommand({
			Name: rule.name,
			EventBusName: rule.eventBusName,
			EventPattern: eventPattern,
		}),
	);
}

async function createQueue(queue: QueueConfig): Promise<void> {
	await sqsClient.send(
		new CreateQueueCommand({
			QueueName: queue.name,
		}),
	);
}

async function createTarget(target: TargetConfig): Promise<void> {
	await eventBridgeClient.send(
		new PutTargetsCommand({
			Rule: target.ruleName,
			EventBusName: target.eventBusName,
			Targets: target.queueName.map((queueName) => {
				return {
					Id: queueName,
					Arn: `arn:aws:sqs:us-east-1:000000000000:${queueName}`,
				};
			}),
		}),
	);
}

function extractRulesFromQueues(queues: QueueConfig[], eventBusName: string): RuleConfig[] {
	const uniquePatterns = new Set<string>();

	queues.forEach((queue) => {
		queue.rulePattern.forEach((pattern) => {
			uniquePatterns.add(pattern);
		});
	});

	return Array.from(uniquePatterns).map((pattern) => ({
		name: formatRuleName(pattern),
		eventBusName,
		rulePattern: pattern,
	}));
}

function extractTargetsFromQueues(queues: QueueConfig[], eventBusName: string): TargetConfig[] {
	const targetsMap: Map<string, TargetConfig> = new Map();

	queues.forEach((queue) => {
		queue.rulePattern.forEach((pattern) => {
			const ruleName = formatRuleName(pattern);
			if (!targetsMap.has(ruleName)) {
				targetsMap.set(ruleName, {
					eventBusName,
					ruleName,
					queueName: [queue.name],
				});
			} else {
				const target = targetsMap.get(ruleName);

				if (target) {
					target.queueName.push(queue.name);
				}
			}
		});
	});

	return Array.from(targetsMap.values());
}

function formatRuleName(rulePattern: string): string {
	return `rule-${rulePattern.replace("*", "all")}`;
}

main().catch(console.error);
