import { Product } from "../../domain/Product";
import { ProductRepository } from "../../domain/ProductRepository";

export class AllProductsSearcher {
	constructor(private readonly repository: ProductRepository) {}

	async search(): Promise<Product[]> {
		return this.repository.searchAll();
	}
}
