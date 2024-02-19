import { faker } from "@faker-js/faker";

import { EmailBody } from "../../../../../src/contexts/retention/email/domain/EmailBody";

export class EmailBodyMother {
	static create(value?: string): EmailBody {
		return new EmailBody(value ?? faker.string.alpha());
	}
}
