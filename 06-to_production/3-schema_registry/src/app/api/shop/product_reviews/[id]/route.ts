import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest } from "next/server";

import { MariaDBConnection } from "../../../../../contexts/shared/infrastructure/MariaDBConnection";
import { ProductReviewCreator } from "../../../../../contexts/shop/product_reviews/application/create/ProductReviewCreator";
import { MySqlProductReviewRepository } from "../../../../../contexts/shop/product_reviews/infrastructure/MySqlProductReviewRepository";
import { UserFinder } from "../../../../../contexts/shop/users/application/find/UserFinder";
import { MySqlUserRepository } from "../../../../../contexts/shop/users/infrastructure/MySqlUserRepository";

const CreateProductReviewRequest = t.type({
	userId: t.string,
	productId: t.string,
	rating: t.number,
	comment: t.string,
});

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateProductReviewRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return new Response(`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`, {
			status: 400,
		});
	}

	const body = validatedRequest.right;

	await new ProductReviewCreator(
		new MySqlProductReviewRepository(new MariaDBConnection()),
		new UserFinder(new MySqlUserRepository(new MariaDBConnection())),
	).create(id, body.userId, body.productId, body.rating, body.comment);

	return new Response("", { status: 201 });
}
