import { Money } from "../../../shared/domain/Money";
import { ProductFeaturedReview, ProductFeaturedReviewPrimitives } from "./ProductFeaturedReview";
import { ProductId } from "./ProductId";
import { ProductImageUrls } from "./ProductImageUrls";
import { ProductName } from "./ProductName";
import { ProductRating } from "./ProductRating";

export type ProductPrimitives = {
	id: string;
	name: string;
	price: {
		amount: number;
		currency: "EUR" | "USD";
	};
	imageUrls: string[];
	featuredReview: {
		comment: string;
		rating: number;
	} | null;
	rating: number | null;
};

export class Product {
	public readonly id: ProductId;
	public readonly name: ProductName;
	public readonly price: Money;
	public readonly imageUrls: ProductImageUrls;
	public readonly featuredReview?: ProductFeaturedReview | null;
	public readonly rating?: ProductRating | null;

	constructor(
		id: string,
		name: string,
		price: Money,
		imageUrls: string[],
		featuredReview?: ProductFeaturedReviewPrimitives | null,
		rating?: number | null,
	) {
		this.id = new ProductId(id);
		this.name = new ProductName(name);
		this.price = price;
		this.imageUrls = ProductImageUrls.fromPrimitives(imageUrls);
		this.featuredReview = featuredReview
			? ProductFeaturedReview.fromPrimitives(featuredReview)
			: null;
		this.rating = rating ? new ProductRating(rating) : null;
	}

	static create(id: string, name: string, price: Money, imageUrls: string[]): Product {
		return new Product(id, name, price, imageUrls);
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
			featuredReview: this.featuredReview ? this.featuredReview.toPrimitives() : null,
			rating: this.rating ? this.rating.value : null,
		};
	}
}
