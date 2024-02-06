import { EmailAddress } from "../../../shared/domain/EmailAddress";
import { UserId } from "../../../shop/users/domain/UserId";
import { Email } from "./Email";
import { EmailBody } from "./EmailBody";
import { EmailId } from "./EmailId";
import { WelcomeEmailSentDomainEvent } from "./WelcomeEmailSentDomainEvent";

export type WelcomeEmailPrimitives = {
	id: string;
	userId: string;
	userName: string;
	from: string;
	to: string;
	body: string;
};

export class WelcomeEmail extends Email {
	private static readonly from = "soporte@codely.com";

	private constructor(
		id: EmailId,
		from: EmailAddress,
		to: EmailAddress,
		body: EmailBody,
		private readonly userId: UserId,
		private readonly userName: string,
	) {
		super(id, from, to, body);
	}

	static send(id: string, userId: string, name: string, emailAddress: string): WelcomeEmail {
		const from = new EmailAddress(WelcomeEmail.from);
		const body = WelcomeEmail.generateBody(userId, name);

		const email = new WelcomeEmail(
			new EmailId(id),
			from,
			new EmailAddress(emailAddress),
			body,
			new UserId(userId),
			name,
		);

		email.record(
			new WelcomeEmailSentDomainEvent(id, userId, name, from.value, emailAddress, body.value),
		);

		return email;
	}

	static fromPrimitives(primitives: WelcomeEmailPrimitives): WelcomeEmail {
		return new WelcomeEmail(
			new EmailId(primitives.id),
			new EmailAddress(primitives.from),
			new EmailAddress(primitives.to),
			new EmailBody(primitives.body),
			new UserId(primitives.userId),
			primitives.userName,
		);
	}

	private static generateBody(userId: string, userName: string): EmailBody {
		return new EmailBody(`
		¡Enhorabuena por el registro, ${userName}!
		
		Completa tu perfil para finalizar: https://codely.com/user/${userId}.
		`);
	}

	toPrimitives(): WelcomeEmailPrimitives {
		return {
			id: this.id.value,
			userId: this.userId.value,
			userName: this.userName,
			from: this.from.value,
			to: this.to.value,
			body: this.body.value,
		};
	}
}
