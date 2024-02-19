import "reflect-metadata";

import fs from "fs";
import path from "path";

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

const subscribers = container
	.findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>("subscriber")
	.map((id) => container.get(id));

const queues: QueueConfig[] = subscribers.map((subscriber) => ({
	name: subscriber.name().replaceAll(".", "-"),
	rulePattern: subscriber.subscribedTo().map((event) => event.eventName),
}));

const terraformDirectory = "./build/terraform";

async function main(): Promise<void> {
	const eventBusName = "codely.domain_events";

	writeTerraformFile(`event_bus_${eventBusName}`, generateEventBusTerraform(eventBusName));

	queues.forEach((queue) => {
		writeTerraformFile(`sqs_queue_${queue.name}`, generateSQSQueueTerraform(queue));
	});

	const rules = extractRulesFromQueues(queues, eventBusName);
	rules.forEach((rule) => {
		writeTerraformFile(`event_rule_${rule.name}`, generateEventBridgeRuleTerraform(rule));
	});

	const targets = extractTargetsFromQueues(queues, eventBusName);
	targets.forEach((target) => {
		writeTerraformFile(
			`event_target_${target.ruleName}`,
			generateEventBridgeTargetTerraform(target),
		);
	});
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

function generateEventBusTerraform(eventBusName: string): string {
	return `
resource "aws_cloudwatch_event_bus" "${eventBusName.replaceAll(".", "-")}" {
  name = "${eventBusName}"
}
`;
}

function generateSQSQueueTerraform(queue: QueueConfig): string {
	const deadLetterQueueName = `${queue.name}-dl`;

	return `
resource "aws_sqs_queue" "${deadLetterQueueName.replaceAll(".", "-")}" {
  name = "${deadLetterQueueName}"
}

resource "aws_sqs_queue" "${queue.name.replaceAll(".", "-")}" {
  name                       = "${queue.name}"
  visibility_timeout_seconds = 3
  redrive_policy             = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.${deadLetterQueueName}.arn
    maxReceiveCount     = 2
  })
}
`;
}

function generateEventBridgeRuleTerraform(rule: RuleConfig): string {
	const eventPattern = rule.rulePattern.includes("*")
		? `{"detail-type": [{"prefix": "${rule.rulePattern.replace("*", "")}"}]}`
		: `{"detail-type": ["${rule.rulePattern}"]}`;

	return `
resource "aws_cloudwatch_event_rule" "${rule.name.replaceAll(".", "-")}" {
  name           = "${rule.name}"
  event_bus_name = "${rule.eventBusName}"
  event_pattern  = <<PATTERN
${eventPattern}
PATTERN
}
`;
}

function generateEventBridgeTargetTerraform(target: TargetConfig): string {
	const targets = target.queueName
		.map((queueName) => {
			return `{
    id: "${queueName}",
    arn: aws_sqs_queue.${queueName}.arn
}`;
		})
		.join(",\n");

	return `
resource "aws_cloudwatch_event_target" "${target.ruleName.replaceAll(".", "-")}" {
  rule           = aws_cloudwatch_event_rule.${target.ruleName}.name
  event_bus_name = "${target.eventBusName}"
  target {
    ${targets}
  }
}
`;
}

function writeTerraformFile(resourceName: string, content: string): void {
	if (!fs.existsSync(terraformDirectory)) {
		fs.mkdirSync(terraformDirectory, { recursive: true });
	}

	fs.writeFileSync(path.join(terraformDirectory, `${resourceName}.tf`), content.trim());
}

main().catch(console.error);
