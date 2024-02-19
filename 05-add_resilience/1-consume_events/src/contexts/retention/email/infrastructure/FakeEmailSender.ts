import { Service } from "diod";

import { Email } from "../domain/Email";
import { EmailSender } from "../domain/EmailSender";

@Service()
export class FakeEmailSender extends EmailSender {
	async send<T extends Email>(_email: T): Promise<void> {
		return Promise.resolve();
	}
}
