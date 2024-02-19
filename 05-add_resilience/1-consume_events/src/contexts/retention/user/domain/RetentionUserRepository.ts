import { UserId } from "../../../shop/users/domain/UserId";
import { RetentionUser } from "./RetentionUser";

export abstract class RetentionUserRepository {
	abstract save(user: RetentionUser): Promise<void>;

	abstract search(id: UserId): Promise<RetentionUser | null>;
}
