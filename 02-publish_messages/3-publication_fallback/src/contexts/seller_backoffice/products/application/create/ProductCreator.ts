import { Money } from "../../../../shared/domain/Money";
import { Product } from "../../domain/Product";
import { ProductRepository } from "../../domain/ProductRepository";

export class ProductCreator {
	constructor(private readonly repository: ProductRepository) {}

	async create(
		id: string,
		name: string,
		price: Money,
		imageUrls: string[],
		creationDate: Date,
	): Promise<void> {
		const product = Product.create(id, name, price, imageUrls, creationDate);

		await this.repository.save(product);
	}
}
