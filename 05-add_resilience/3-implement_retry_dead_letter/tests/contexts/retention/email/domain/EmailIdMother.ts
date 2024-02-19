import { faker } from "@faker-js/faker";

import { EmailId } from "../../../../../src/contexts/retention/email/domain/EmailId";

export class EmailIdMother {
	static create(value?: string): EmailId {
		return new EmailId(value ?? faker.string.uuid());
	}
}
