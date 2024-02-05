import { ProductId } from "../../../products/domain/ProductId";
import { ProductReview } from "../../domain/ProductReview";
import { ProductReviewRepository } from "../../domain/ProductReviewRepository";

export class ProductReviewsByProductSearcher {
	constructor(private readonly repository: ProductReviewRepository) {}

	async search(productId: string): Promise<ProductReview[]> {
		return this.repository.searchByProduct(new ProductId(productId));
	}
}
