import { Product } from "./Product";
import { ProductId } from "./ProductId";

export interface ProductRepository {
	save(product: Product): Promise<void>;

	search(id: ProductId): Promise<Product | null>;

	searchAll(): Promise<Product[]>;
}
