import { UserArchivedDomainEvent } from "../../../../../src/contexts/shop/users/domain/UserArchivedDomainEvent";
import { DateMother } from "./DateMother";
import { UserIdMother } from "./UserIdMother";

export class UserArchivedDomainEventMother {
	static create(id?: string): UserArchivedDomainEvent {
		return new UserArchivedDomainEvent(id ?? UserIdMother.create().value);
	}

	static fromToday(): UserArchivedDomainEvent {
		return new UserArchivedDomainEvent(UserIdMother.create().value, DateMother.today());
	}
}
