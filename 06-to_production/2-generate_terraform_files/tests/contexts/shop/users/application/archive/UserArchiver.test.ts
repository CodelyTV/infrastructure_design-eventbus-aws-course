import { UserArchiver } from "../../../../../../src/contexts/shop/users/application/archive/UserArchiver";
import { UserDoesNotExist } from "../../../../../../src/contexts/shop/users/domain/UserDoesNotExist";
import { UserStatus } from "../../../../../../src/contexts/shop/users/domain/UserStatus";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { UserArchivedDomainEventMother } from "../../domain/UserArchivedDomainEventMother";
import { UserIdMother } from "../../domain/UserIdMother";
import { UserMother } from "../../domain/UserMother";
import { MockUserRepository } from "../../infrastructure/MockUserRepository";

describe("UserArchiver should", () => {
	const repository = new MockUserRepository();
	const eventBus = new MockEventBus();
	const userArchiver = new UserArchiver(repository, eventBus);

	it("throw an error if the user does not exist", async () => {
		const userId = UserIdMother.create();

		repository.shouldNotSearch(userId);

		await expect(userArchiver.archive(userId.value)).rejects.toThrow(
			new UserDoesNotExist(userId.value),
		);
	});

	it("update the status to archived of an existing user", async () => {
		const existingUser = UserMother.create();

		const archivedUser = UserMother.create({
			...existingUser.toPrimitives(),
			status: UserStatus.Archived,
		});
		const expectedDomainEvent = UserArchivedDomainEventMother.create(existingUser.id.value);

		repository.shouldSearch(existingUser);
		repository.shouldSave(archivedUser);
		eventBus.shouldPublish([expectedDomainEvent]);

		await userArchiver.archive(existingUser.id.value);
	});
});
