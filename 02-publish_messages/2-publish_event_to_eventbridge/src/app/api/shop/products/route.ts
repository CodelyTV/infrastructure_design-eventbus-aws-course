import { NextResponse } from "next/server";

import { MariaDBConnection } from "../../../../contexts/shared/infrastructure/MariaDBConnection";
import { AllProductsSearcher } from "../../../../contexts/shop/products/application/search_all/AllProductsSearcher";
import { ProductPrimitives } from "../../../../contexts/shop/products/domain/Product";
import { MySqlProductRepository } from "../../../../contexts/shop/products/infrastructure/MySqlProductRepository";

export async function GET(): Promise<NextResponse<ProductPrimitives[]> | Response> {
	const searcher = new AllProductsSearcher(new MySqlProductRepository(new MariaDBConnection()));

	const products = await searcher.search();

	return NextResponse.json(products.map((product) => product.toPrimitives()));
}
