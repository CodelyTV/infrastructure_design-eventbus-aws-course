import { WelcomeEmailPrimitives } from "../../../../../src/contexts/retention/email/domain/WelcomeEmail";
import { WelcomeEmailSentDomainEvent } from "../../../../../src/contexts/retention/email/domain/WelcomeEmailSentDomainEvent";
import { EmailAddressMother } from "../../../shared/domain/EmailAddressMother";
import { UserIdMother } from "../../../shop/users/domain/UserIdMother";
import { UserNameMother } from "../../../shop/users/domain/UserNameMother";
import { EmailBodyMother } from "./EmailBodyMother";
import { EmailIdMother } from "./EmailIdMother";

export class WelcomeEmailSentDomainEventMother {
	static create(params?: Partial<WelcomeEmailPrimitives>): WelcomeEmailSentDomainEvent {
		const primitives: WelcomeEmailPrimitives = {
			id: EmailIdMother.create().value,
			userId: UserIdMother.create().value,
			userName: UserNameMother.create().value,
			from: EmailAddressMother.create().value,
			to: EmailAddressMother.create().value,
			body: EmailBodyMother.create().value,
			...params,
		};

		return new WelcomeEmailSentDomainEvent(
			primitives.id,
			primitives.userId,
			primitives.userName,
			primitives.from,
			primitives.to,
			primitives.body,
		);
	}
}
