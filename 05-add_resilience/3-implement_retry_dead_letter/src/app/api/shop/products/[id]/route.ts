import { NextResponse } from "next/server";

import { MariaDBConnection } from "../../../../../contexts/shared/infrastructure/MariaDBConnection";
import { ProductSearcher } from "../../../../../contexts/shop/products/application/search/ProductSearcher";
import { ProductPrimitives } from "../../../../../contexts/shop/products/domain/Product";
import { MySqlProductRepository } from "../../../../../contexts/shop/products/infrastructure/MySqlProductRepository";

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<ProductPrimitives> | Response> {
	const searcher = new ProductSearcher(new MySqlProductRepository(new MariaDBConnection()));

	const product = await searcher.search(id);

	if (product === null) {
		return new Response("", { status: 404 });
	}

	return NextResponse.json(product.toPrimitives());
}
