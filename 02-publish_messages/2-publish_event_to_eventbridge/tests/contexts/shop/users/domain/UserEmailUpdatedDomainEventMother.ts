import {
	UserEmailUpdatedDomainEvent,
	UserEmailUpdatedDomainEventPrimitives,
} from "../../../../../src/contexts/shop/users/domain/UserEmailUpdatedDomainEvent";
import { DateMother } from "./DateMother";
import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";

export class UserEmailUpdatedDomainEventMother {
	static create(
		params?: Partial<UserEmailUpdatedDomainEventPrimitives> & { occurredOn?: Date },
	): UserEmailUpdatedDomainEvent {
		const primitives = {
			id: UserIdMother.create().value,
			email: UserEmailMother.create().value,
			...params,
		};

		return new UserEmailUpdatedDomainEvent(primitives.id, primitives.email, primitives.occurredOn);
	}

	static fromToday(): UserEmailUpdatedDomainEvent {
		return UserEmailUpdatedDomainEventMother.create({ occurredOn: DateMother.today() });
	}

	static fromYesterday(): UserEmailUpdatedDomainEvent {
		return UserEmailUpdatedDomainEventMother.create({ occurredOn: DateMother.yesterday() });
	}
}
