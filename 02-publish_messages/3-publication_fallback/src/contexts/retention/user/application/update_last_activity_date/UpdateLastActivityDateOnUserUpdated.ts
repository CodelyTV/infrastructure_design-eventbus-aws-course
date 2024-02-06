import { DomainEventName } from "../../../../shared/domain/event/DomainEventName";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { UserArchivedDomainEvent } from "../../../../shop/users/domain/UserArchivedDomainEvent";
import { UserEmailUpdatedDomainEvent } from "../../../../shop/users/domain/UserEmailUpdatedDomainEvent";
import { UserLastActivityUpdater } from "./UserLastActivityUpdater";

export class UpdateLastActivityDateOnUserUpdated
	implements DomainEventSubscriber<UserArchivedDomainEvent | UserEmailUpdatedDomainEvent>
{
	constructor(private readonly updater: UserLastActivityUpdater) {}

	async on(event: UserArchivedDomainEvent | UserEmailUpdatedDomainEvent): Promise<void> {
		await this.updater.update(event.id, event.occurredOn);
	}

	subscribedTo(): DomainEventName<UserArchivedDomainEvent | UserEmailUpdatedDomainEvent>[] {
		return [UserArchivedDomainEvent, UserEmailUpdatedDomainEvent];
	}
}
