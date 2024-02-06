import { UserId } from "../../../shop/users/domain/UserId";

export type RetentionUserPrimitives = {
	id: string;
	lastActivityDate: Date;
};

export class RetentionUser {
	constructor(
		public readonly id: UserId,
		private lastActivityDate: Date,
	) {}

	static fromPrimitives(primitives: RetentionUserPrimitives): RetentionUser {
		return new RetentionUser(new UserId(primitives.id), primitives.lastActivityDate);
	}

	updateLastActivityDate(lastActivityDate: Date): void {
		this.lastActivityDate = lastActivityDate;
	}

	toPrimitives(): RetentionUserPrimitives {
		return {
			id: this.id.value,
			lastActivityDate: this.lastActivityDate,
		};
	}

	lastActivityDateIsOlderThan(other: Date): boolean {
		return this.lastActivityDate < other;
	}
}
