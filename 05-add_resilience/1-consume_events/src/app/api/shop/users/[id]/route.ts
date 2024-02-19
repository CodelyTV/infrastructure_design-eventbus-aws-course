import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { AwsEventBridgeEventBus } from "../../../../../contexts/shared/infrastructure/event_bus/AwsEventBridgeEventBus";
import { DomainEventFailover } from "../../../../../contexts/shared/infrastructure/event_bus/failover/DomainEventFailover";
import { MariaDBConnection } from "../../../../../contexts/shared/infrastructure/MariaDBConnection";
import { UserRegistrar } from "../../../../../contexts/shop/users/application/registrar/UserRegistrar";
import { UserSearcher } from "../../../../../contexts/shop/users/application/search/UserSearcher";
import { UserPrimitives } from "../../../../../contexts/shop/users/domain/User";
import { MySqlUserRepository } from "../../../../../contexts/shop/users/infrastructure/MySqlUserRepository";

const CreateUserRequest = t.type({ name: t.string, email: t.string, profilePicture: t.string });

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateUserRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return new Response(`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`, {
			status: 400,
		});
	}

	const body = validatedRequest.right;

	const mariaDBConnection = new MariaDBConnection();

	await new UserRegistrar(
		new MySqlUserRepository(mariaDBConnection),
		new AwsEventBridgeEventBus(new DomainEventFailover(mariaDBConnection)),
	).registrar(id, body.name, body.email, body.profilePicture);

	return new Response("", { status: 201 });
}

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<UserPrimitives> | Response> {
	const searcher = new UserSearcher(new MySqlUserRepository(new MariaDBConnection()));

	const user = await searcher.search(id);

	if (user === null) {
		return new Response("", { status: 404 });
	}

	return NextResponse.json(user.toPrimitives());
}
