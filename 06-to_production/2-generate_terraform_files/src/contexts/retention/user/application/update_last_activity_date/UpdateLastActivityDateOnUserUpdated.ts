import { Service } from "diod";

import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { UserDomainEvent } from "../../../../shop/users/domain/UserDomainEvent";
import { UserLastActivityUpdater } from "./UserLastActivityUpdater";

@Service()
export class UpdateLastActivityDateOnUserUpdated implements DomainEventSubscriber<UserDomainEvent> {
	constructor(private readonly updater: UserLastActivityUpdater) {}

	async on(event: UserDomainEvent): Promise<void> {
		await this.updater.update(event.id, event.occurredOn);
	}

	subscribedTo(): DomainEventClass[] {
		return [UserDomainEvent];
	}

	name(): string {
		return "codely.retention.update_last_activity_date_on_user_updated";
	}
}
