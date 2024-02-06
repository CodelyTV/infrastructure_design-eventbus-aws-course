import { NextResponse } from "next/server";

import { AllProductsSearcher } from "../../../../contexts/seller_backoffice/products/application/search_all/AllProductsSearcher";
import { ProductPrimitives } from "../../../../contexts/seller_backoffice/products/domain/Product";
import { MySqlProductRepository } from "../../../../contexts/seller_backoffice/products/infrastructure/MySqlProductRepository";
import { MariaDBConnection } from "../../../../contexts/shared/infrastructure/MariaDBConnection";

export async function GET(): Promise<NextResponse<ProductPrimitives[]> | NextResponse> {
	const searcher = new AllProductsSearcher(new MySqlProductRepository(new MariaDBConnection()));

	const products = await searcher.search();

	return NextResponse.json(products.map((product) => product.toPrimitives()));
}
