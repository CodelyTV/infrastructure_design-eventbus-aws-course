import { Money } from "../../../shared/domain/Money";
import { ProductId } from "./ProductId";
import { ProductImageUrls } from "./ProductImageUrls";
import { ProductName } from "./ProductName";
import { ProductViews } from "./ProductViews";

export type ProductPrimitives = {
	id: string;
	name: string;
	price: {
		amount: number;
		currency: "EUR" | "USD";
	};
	imageUrls: string[];
	views: number;
	creationDate: Date;
};

export class Product {
	public readonly id: ProductId;
	public readonly name: ProductName;
	public readonly price: Money;
	public readonly imageUrls: ProductImageUrls;
	public readonly views: ProductViews;
	public readonly creationDate: Date;

	constructor(
		id: string,
		name: string,
		price: Money,
		imageUrls: string[],
		views: number,
		creationDate: Date,
	) {
		this.id = new ProductId(id);
		this.name = new ProductName(name);
		this.price = price;
		this.imageUrls = ProductImageUrls.fromPrimitives(imageUrls);
		this.views = new ProductViews(views);
		this.creationDate = creationDate;
	}

	static create(id: string, name: string, price: Money, imageUrls: string[], date: Date): Product {
		return new Product(id, name, price, imageUrls, ProductViews.initialice().value, date);
	}

	toPrimitives(): ProductPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
			price: {
				amount: this.price.amount,
				currency: this.price.currency,
			},
			imageUrls: this.imageUrls.toPrimitives(),
			views: this.views.value,
			creationDate: this.creationDate,
		};
	}
}
