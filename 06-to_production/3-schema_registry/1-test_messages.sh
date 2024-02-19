aws events put-events \
	--region us-east-1 \
	--entries '[{
		"EventBusName": "codely.domain_events",
		"Source": "codely",
		"DetailType": "codely.shop.user.registered",
		"Detail": "{\"data\":{\"id\":\"98d27fb1-5dcb-4b00-9b63-ebdb64a5c8ec\",\"type\":\"codely.shop.user.registered\",\"occurredOn\":\"2024-02-19T11:32:04.467Z\",\"aggregateId\":\"78372351-899f-4209-9410-b21d33524c8a\",\"attributes\":{\"id\":\"78372351-899f-4209-9410-b21d33524c8a\",\"name\":\"Javier Ferrer\",\"email\":\"javierferrer@gmail.com\",\"profilePicture\":\"https://\",\"status\":\"active\"}}}"
	}]'
