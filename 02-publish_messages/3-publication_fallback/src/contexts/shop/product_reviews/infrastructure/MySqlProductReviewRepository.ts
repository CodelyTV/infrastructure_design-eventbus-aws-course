import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { ProductId } from "../../products/domain/ProductId";
import { ProductReview } from "../domain/ProductReview";
import { ProductReviewRepository } from "../domain/ProductReviewRepository";

type DatabaseProductReview = {
	id: string;
	userId: string;
	productId: string;
	rating: number;
	comment: string;
	userName: string;
	userProfilePicture: string;
};

export class MySqlProductReviewRepository implements ProductReviewRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async save(review: ProductReview): Promise<void> {
		const query = `
		INSERT INTO shop__product_reviews (id, user_id, product_id, rating, comment, is_featured)
		VALUES (
			'${review.id.value}',
			'${review.userId.value}',
			'${review.productId.value}',
			${review.rating.value},
			'${review.comment.value}',
			0
		);`;

		await this.connection.execute(query);
	}

	async searchByProduct(productId: ProductId): Promise<ProductReview[]> {
		const query = `
		SELECT
			r.id,
			r.user_id as userId,
			r.product_id as productId,
			r.rating,
			r.comment,
			u.name as userName,
			u.profile_picture as userProfilePicture
		FROM shop__product_reviews r
		INNER JOIN shop__users u ON r.user_id = u.id
		WHERE r.product_id = '${productId.value}'
	`;

		const result = await this.connection.searchAll<DatabaseProductReview>(query);

		return result.map(
			(productReview) =>
				new ProductReview(
					productReview.id,
					productReview.userId,
					productReview.productId,
					productReview.rating,
					productReview.comment,
					productReview.userName,
					productReview.userProfilePicture,
				),
		);
	}
}
