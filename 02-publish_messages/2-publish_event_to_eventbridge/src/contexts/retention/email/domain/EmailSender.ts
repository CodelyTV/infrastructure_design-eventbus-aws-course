import { Email } from "./Email";

export interface EmailSender {
	send<T extends Email>(email: T): Promise<void>;
}
