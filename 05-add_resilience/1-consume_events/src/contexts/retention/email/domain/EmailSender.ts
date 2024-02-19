import { Email } from "./Email";

export abstract class EmailSender {
	abstract send<T extends Email>(email: T): Promise<void>;
}
