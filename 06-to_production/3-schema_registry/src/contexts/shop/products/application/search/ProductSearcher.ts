import { Product } from "../../domain/Product";
import { ProductId } from "../../domain/ProductId";
import { ProductRepository } from "../../domain/ProductRepository";

export class ProductSearcher {
	constructor(private readonly repository: ProductRepository) {}

	async search(id: string): Promise<Product | null> {
		return this.repository.search(new ProductId(id));
	}
}
