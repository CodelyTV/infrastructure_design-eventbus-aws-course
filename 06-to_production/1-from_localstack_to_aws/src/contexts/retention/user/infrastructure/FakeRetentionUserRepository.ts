import { Service } from "diod";

import { UserId } from "../../../shop/users/domain/UserId";
import { RetentionUser } from "../domain/RetentionUser";
import { RetentionUserRepository } from "../domain/RetentionUserRepository";

@Service()
export class FakeRetentionUserRepository extends RetentionUserRepository {
	async save(_user: RetentionUser): Promise<void> {
		return Promise.resolve();
	}

	async search(_id: UserId): Promise<RetentionUser | null> {
		return Promise.resolve(null);
	}
}
