import { User } from "../../domain/User";
import { UserFinder as DomainUserFinder } from "../../domain/UserFinder";
import { UserRepository } from "../../domain/UserRepository";

export class UserFinder {
	private readonly finder: DomainUserFinder;

	constructor(private readonly repository: UserRepository) {
		this.finder = new DomainUserFinder(repository);
	}

	async find(id: string): Promise<User> {
		return this.finder.find(id);
	}
}
