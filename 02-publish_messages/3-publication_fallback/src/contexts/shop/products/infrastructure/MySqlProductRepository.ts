import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { Product } from "../domain/Product";
import { ProductFeaturedReviewPrimitives } from "../domain/ProductFeaturedReview";
import { ProductId } from "../domain/ProductId";
import { ProductRepository } from "../domain/ProductRepository";

type DatabaseProduct = {
	id: string;
	name: string;
	amount: number;
	currency: "EUR" | "USD";
	imageUrls: string;
	featuredReview: string | null;
	rating: number | null;
};

export class MySqlProductRepository implements ProductRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async search(id: ProductId): Promise<Product | null> {
		const query = `
	SELECT
		id,
		name,
		price_amount as amount,
		price_currency as currency,
		image_urls as imageUrls,
		featured_review as featuredReview,
        rating as rating
	FROM shop__products__view
	WHERE id='${id.value}'
	GROUP BY id
  `;

		const result = await this.connection.searchOne<DatabaseProduct>(query);

		if (!result) {
			return null;
		}

		return new Product(
			result.id,
			result.name,
			{
				amount: result.amount,
				currency: result.currency,
			},
			result.imageUrls as unknown as string[],
			(result.featuredReview as unknown as ProductFeaturedReviewPrimitives | null)?.rating
				? (result.featuredReview as unknown as ProductFeaturedReviewPrimitives)
				: null,
			result.rating as unknown as number,
		);
	}

	async searchAll(): Promise<Product[]> {
		const query = `
            SELECT
                id,
                name,
                price_amount as amount,
                price_currency as currency,
                image_urls as imageUrls,
                featured_review as featuredReview,
                rating as rating
            FROM shop__products__view
            GROUP BY id
	`;

		const result = await this.connection.searchAll<DatabaseProduct>(query);

		return result.map(
			(product) =>
				new Product(
					product.id,
					product.name,
					{
						amount: product.amount,
						currency: product.currency,
					},
					product.imageUrls as unknown as string[],
					(product.featuredReview as unknown as ProductFeaturedReviewPrimitives | null)?.rating
						? (product.featuredReview as unknown as ProductFeaturedReviewPrimitives)
						: null,
					product.rating as unknown as number,
				),
		);
	}
}
