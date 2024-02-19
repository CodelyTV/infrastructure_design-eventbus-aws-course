import { ProductId } from "../../products/domain/ProductId";
import { ProductReview } from "./ProductReview";

export interface ProductReviewRepository {
	save(review: ProductReview): Promise<void>;

	searchByProduct(productId: ProductId): Promise<ProductReview[]>;
}
