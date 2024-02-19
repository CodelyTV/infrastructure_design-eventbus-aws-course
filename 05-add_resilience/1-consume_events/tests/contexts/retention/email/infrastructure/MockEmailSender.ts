import { Email } from "../../../../../src/contexts/retention/email/domain/Email";
import { EmailSender } from "../../../../../src/contexts/retention/email/domain/EmailSender";

export class MockEmailSender implements EmailSender {
	private readonly mockSend = jest.fn();

	async send<T extends Email>(email: T): Promise<void> {
		expect(this.mockSend).toHaveBeenCalledWith(email.toPrimitives());
	}

	shouldSend<T extends Email>(email: T): void {
		this.mockSend(email.toPrimitives());
	}
}
