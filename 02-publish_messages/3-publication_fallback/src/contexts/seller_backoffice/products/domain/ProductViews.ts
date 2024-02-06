export class ProductViews {
	constructor(public readonly value: number) {}

	static initialice(): ProductViews {
		return new ProductViews(0);
	}
}
