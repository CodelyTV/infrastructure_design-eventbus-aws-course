import { AwsEventBridgeEventBus } from "../../../../contexts/shared/infrastructure/event_bus/AwsEventBridgeEventBus";
import { DomainEventFailover } from "../../../../contexts/shared/infrastructure/event_bus/failover/DomainEventFailover";
import { MariaDBConnection } from "../../../../contexts/shared/infrastructure/MariaDBConnection";

export async function POST(): Promise<Response> {
	const eventBus = new AwsEventBridgeEventBus(new DomainEventFailover(new MariaDBConnection()));

	await eventBus.publishFromFailover();

	return new Response("", { status: 201 });
}
