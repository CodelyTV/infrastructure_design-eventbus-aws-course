import { UpdateLastActivityDateOnUserUpdated } from "../../../../../../src/contexts/retention/user/application/update_last_activity_date/UpdateLastActivityDateOnUserUpdated";
import { UserLastActivityUpdater } from "../../../../../../src/contexts/retention/user/application/update_last_activity_date/UserLastActivityUpdater";
import { UserArchivedDomainEvent } from "../../../../../../src/contexts/shop/users/domain/UserArchivedDomainEvent";
import { UserEmailUpdatedDomainEvent } from "../../../../../../src/contexts/shop/users/domain/UserEmailUpdatedDomainEvent";
import { UserArchivedDomainEventMother } from "../../../../shop/users/domain/UserArchivedDomainEventMother";
import { UserEmailUpdatedDomainEventMother } from "../../../../shop/users/domain/UserEmailUpdatedDomainEventMother";
import { UserIdMother } from "../../../../shop/users/domain/UserIdMother";
import { RetentionUserMother } from "../../domain/RetentionUserMother";
import { MockRetentionUserRepository } from "../../infrastructure/MockRetentionUserRepository";

describe("UpdateLastActivityDateOnUserUpdated should", () => {
	const repository = new MockRetentionUserRepository();
	const subscriber = new UpdateLastActivityDateOnUserUpdated(
		new UserLastActivityUpdater(repository),
	);

	it("throw an error if the user does not exist", async () => {
		const event = UserEmailUpdatedDomainEventMother.create();
		const userId = UserIdMother.create(event.id);

		repository.shouldNotSearch(userId);

		await expect(subscriber.on(event)).rejects.toThrow(Error);
	});

	it("not update last activity when the new is older than the actual", async () => {
		const event = UserEmailUpdatedDomainEventMother.fromYesterday();
		const existingUser = RetentionUserMother.fromToday(event.id);

		repository.shouldSearch(existingUser);

		await subscriber.on(event);
	});

	it("update last activity when the new is newer than the actual", async () => {
		await Promise.all(
			validEvents().map(async (event) => {
				const existingUser = RetentionUserMother.fromYesterday(event.id);

				const updatedUser = RetentionUserMother.create({
					...existingUser.toPrimitives(),
					lastActivityDate: event.occurredOn,
				});

				repository.shouldSearch(existingUser);
				repository.shouldSave(updatedUser);

				await subscriber.on(event);
			}),
		);
	});

	function validEvents(): (UserEmailUpdatedDomainEvent | UserArchivedDomainEvent)[] {
		return [
			UserEmailUpdatedDomainEventMother.fromToday(),
			UserArchivedDomainEventMother.fromToday(),
		];
	}
});
