export interface UuidGenerator {
	generate(): Promise<string>;
}
