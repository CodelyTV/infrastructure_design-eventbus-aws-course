import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { Product } from "../domain/Product";
import { ProductId } from "../domain/ProductId";
import { ProductRepository } from "../domain/ProductRepository";

type DatabaseProduct = {
	id: string;
	name: string;
	amount: number;
	currency: "EUR" | "USD";
	imageUrls: string;
	views: number;
	creationDate: Date;
};

export class MySqlProductRepository implements ProductRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async save(product: Product): Promise<void> {
		const query = `
			INSERT INTO seller_backoffice__products (id, name, price_amount, price_currency, image_urls, views, creation_date)
			VALUES (
				'${product.id.value}',
				'${product.name.value}',
				${product.price.amount},
				'${product.price.currency}', 
				'${product.imageUrls.toJSON()}',
				${product.views.value},
                '${product.creationDate.toISOString().slice(0, 19).replace("T", " ")}'
			);`;

		await this.connection.execute(query);
	}

	async search(id: ProductId): Promise<Product | null> {
		const query = `
	SELECT
		id,
		name,
		price_amount as amount,
		price_currency as currency,
		image_urls as imageUrls,
		views as views,
		creation_date as creationDate
	FROM seller_backoffice__products
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
			result.views as unknown as number,
			new Date(result.creationDate),
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
            views as views,
            creation_date as creationDate
		FROM seller_backoffice__products
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
					product.views as unknown as number,
					new Date(product.creationDate),
				),
		);
	}
}
