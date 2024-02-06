import { UserEmailUpdater } from "../../../../../../src/contexts/shop/users/application/update_email/UserEmailUpdater";
import { UserDoesNotExist } from "../../../../../../src/contexts/shop/users/domain/UserDoesNotExist";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { UserEmailMother } from "../../domain/UserEmailMother";
import { UserEmailUpdatedDomainEventMother } from "../../domain/UserEmailUpdatedDomainEventMother";
import { UserIdMother } from "../../domain/UserIdMother";
import { UserMother } from "../../domain/UserMother";
import { MockUserRepository } from "../../infrastructure/MockUserRepository";

describe("UserEmailUpdater should", () => {
	const repository = new MockUserRepository();
	const eventBus = new MockEventBus();
	const userEmailUpdater = new UserEmailUpdater(repository, eventBus);

	it("throw an error if the user does not exist", async () => {
		const userId = UserIdMother.create();
		const email = UserEmailMother.create();

		repository.shouldNotSearch(userId);

		await expect(userEmailUpdater.update(userId.value, email.value)).rejects.toThrow(
			new UserDoesNotExist(userId.value),
		);
	});

	it("update the email of an existing user", async () => {
		const existingUser = UserMother.create();
		const newEmail = UserEmailMother.create();

		const userWithNewEmail = UserMother.create({
			...existingUser.toPrimitives(),
			email: newEmail.value,
		});
		const expectedDomainEvent = UserEmailUpdatedDomainEventMother.create({
			id: existingUser.id.value,
			email: newEmail.value,
		});

		repository.shouldSearch(existingUser);
		repository.shouldSave(userWithNewEmail);
		eventBus.shouldPublish([expectedDomainEvent]);

		await userEmailUpdater.update(existingUser.id.value, newEmail.value);
	});
});
