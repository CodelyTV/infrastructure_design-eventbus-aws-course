import { UuidGenerator } from "../../../../src/contexts/shared/domain/UuidGenerator";

export class MockUuidGenerator implements UuidGenerator {
	private readonly mockGenerate = jest.fn();

	async generate(): Promise<string> {
		expect(this.mockGenerate).toHaveBeenCalledWith();

		return this.mockGenerate() as Promise<string>;
	}

	shouldGenerate(uuid: string): void {
		this.mockGenerate();
		this.mockGenerate.mockReturnValueOnce(uuid);
	}
}
