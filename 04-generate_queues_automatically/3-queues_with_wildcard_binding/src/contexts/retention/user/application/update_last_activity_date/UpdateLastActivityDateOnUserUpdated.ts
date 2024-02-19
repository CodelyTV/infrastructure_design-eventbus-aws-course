import { Service } from "diod";

import { DomainEventName } from "../../../../shared/domain/event/DomainEventName";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { UserArchivedDomainEvent } from "../../../../shop/users/domain/UserArchivedDomainEvent";
import { UserEmailUpdatedDomainEvent } from "../../../../shop/users/domain/UserEmailUpdatedDomainEvent";
import { UserLastActivityUpdater } from "./UserLastActivityUpdater";

type UserActivityEvent = UserArchivedDomainEvent | UserEmailUpdatedDomainEvent;

@Service()
export class UpdateLastActivityDateOnUserUpdated
	implements DomainEventSubscriber<UserActivityEvent>
{
	constructor(private readonly updater: UserLastActivityUpdater) {}

	async on(event: UserActivityEvent): Promise<void> {
		await this.updater.update(event.id, event.occurredOn);
	}

	subscribedTo(): DomainEventName<UserActivityEvent>[] {
		return [UserArchivedDomainEvent, UserEmailUpdatedDomainEvent];
	}

	name(): string {
		return "codely.retention.update_last_activity_date_on_user_updated";
	}
}
