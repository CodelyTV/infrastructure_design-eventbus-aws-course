export type ProductFeaturedReviewPrimitives = {
	comment: string;
	rating: number;
};

export class ProductFeaturedReview {
	constructor(
		public readonly comment: string,
		public readonly rating: number,
	) {}

	static fromPrimitives(primitives: ProductFeaturedReviewPrimitives): ProductFeaturedReview {
		return new ProductFeaturedReview(primitives.comment, primitives.rating);
	}

	toPrimitives(): ProductFeaturedReviewPrimitives {
		return { comment: this.comment, rating: this.rating };
	}
}
