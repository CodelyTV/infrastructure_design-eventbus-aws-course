import { Service } from "diod";

import { UserId } from "../../../../shop/users/domain/UserId";
import { RetentionUserRepository } from "../../domain/RetentionUserRepository";

@Service()
export class UserLastActivityUpdater {
	constructor(private readonly repository: RetentionUserRepository) {}

	async update(id: string, occurredOn: Date): Promise<void> {
		const user = await this.repository.search(new UserId(id));

		console.log("Last activity updated");

		// if (user === null) {
		// 	throw new Error(`The user with id ${id} does not exists`);
		// }
		//
		// if (user.lastActivityDateIsOlderThan(occurredOn)) {
		// 	user.updateLastActivityDate(occurredOn);
		//
		// 	await this.repository.save(user);
		// }
	}
}
