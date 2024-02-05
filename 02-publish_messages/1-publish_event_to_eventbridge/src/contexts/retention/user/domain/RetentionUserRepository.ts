import { UserId } from "../../../shop/users/domain/UserId";
import { RetentionUser } from "./RetentionUser";

export interface RetentionUserRepository {
	save(user: RetentionUser): Promise<void>;

	search(id: UserId): Promise<RetentionUser | null>;
}
