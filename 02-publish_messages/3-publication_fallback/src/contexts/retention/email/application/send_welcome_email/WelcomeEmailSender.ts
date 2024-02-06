import { EventBus } from "../../../../shared/domain/event/EventBus";
import { UuidGenerator } from "../../../../shared/domain/UuidGenerator";
import { EmailSender } from "../../domain/EmailSender";
import { WelcomeEmail } from "../../domain/WelcomeEmail";

export class WelcomeEmailSender {
	constructor(
		private readonly uuidGenerator: UuidGenerator,
		private readonly sender: EmailSender,
		private readonly eventBus: EventBus,
	) {}

	async send(userId: string, name: string, emailAddress: string): Promise<void> {
		const email = WelcomeEmail.send(
			await this.uuidGenerator.generate(),
			userId,
			name,
			emailAddress,
		);

		await this.sender.send(email);
		await this.eventBus.publish(email.pullDomainEvents());
	}
}
