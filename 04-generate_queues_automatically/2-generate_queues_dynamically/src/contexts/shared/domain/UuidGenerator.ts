export abstract class UuidGenerator {
	abstract generate(): Promise<string>;
}
