import { UserFinder } from "../../../users/application/find/UserFinder";
import { ProductReview } from "../../domain/ProductReview";
import { ProductReviewRepository } from "../../domain/ProductReviewRepository";

export class ProductReviewCreator {
	constructor(
		private readonly repository: ProductReviewRepository,
		private readonly userFinder: UserFinder,
	) {}

	async create(
		id: string,
		userId: string,
		productId: string,
		rating: number,
		comment: string,
	): Promise<void> {
		const user = await this.userFinder.find(userId);

		const product = ProductReview.create(
			id,
			userId,
			productId,
			rating,
			comment,
			user.name.value,
			user.profilePicture.value,
		);

		await this.repository.save(product);
	}
}
