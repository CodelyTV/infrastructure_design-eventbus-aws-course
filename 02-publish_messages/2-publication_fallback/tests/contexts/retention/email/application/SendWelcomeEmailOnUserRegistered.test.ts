import { SendWelcomeEmailOnUserRegistered } from "../../../../../src/contexts/retention/email/application/send_welcome_email/SendWelcomeEmailOnUserRegistered";
import { WelcomeEmailSender } from "../../../../../src/contexts/retention/email/application/send_welcome_email/WelcomeEmailSender";
import { MockEventBus } from "../../../shared/infrastructure/MockEventBus";
import { MockUuidGenerator } from "../../../shared/infrastructure/MockUuidGenerator";
import { UserRegisteredDomainEventMother } from "../../../shop/users/domain/UserRegisteredDomainEventMother";
import { WelcomeEmailMother } from "../domain/WelcomeEmailMother";
import { WelcomeEmailSentDomainEventMother } from "../domain/WelcomeEmailSentDomainEventMother";
import { MockEmailSender } from "../infrastructure/MockEmailSender";

describe("SendWelcomeEmailOnUserRegistered should", () => {
	const uuidGenerator = new MockUuidGenerator();
	const emailSender = new MockEmailSender();
	const eventBus = new MockEventBus();
	const subscriber = new SendWelcomeEmailOnUserRegistered(
		new WelcomeEmailSender(uuidGenerator, emailSender, eventBus),
	);

	it("send a welcome email on user registered", async () => {
		const event = UserRegisteredDomainEventMother.create();

		const email = WelcomeEmailMother.create({
			userId: event.id,
			userName: event.name,
			from: "soporte@codely.com",
			to: event.email,
			body: `
		¡Enhorabuena por el registro, ${event.name}!
		
		Completa tu perfil para finalizar: https://codely.com/user/${event.id}.
		`,
		});

		const expectedEmailPrimitives = email.toPrimitives();

		const expectedDomainEvent = WelcomeEmailSentDomainEventMother.create(expectedEmailPrimitives);

		uuidGenerator.shouldGenerate(email.toPrimitives().id);

		emailSender.shouldSend(email);
		eventBus.shouldPublish([expectedDomainEvent]);

		await subscriber.on(event);
	});
});
