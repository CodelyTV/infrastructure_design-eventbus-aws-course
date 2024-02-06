import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { EmailAddress } from "../../../shared/domain/EmailAddress";
import { EmailBody } from "./EmailBody";
import { EmailId } from "./EmailId";

export abstract class Email extends AggregateRoot {
	protected constructor(
		protected readonly id: EmailId,
		protected readonly from: EmailAddress,
		protected readonly to: EmailAddress,
		protected readonly body: EmailBody,
	) {
		super();
	}

	abstract toPrimitives(): any;
}
