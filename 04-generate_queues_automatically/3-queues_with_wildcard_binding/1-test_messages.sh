aws events put-events \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	--entries '[{
		"EventBusName": "codely.domain_events",
		"Source": "codely",
		"DetailType": "codely.shop.user.registered",
		"Detail": "{ \"id\": \"123\", \"email\": \"javi@hola.com\" }"
	}]'

aws events put-events \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	--entries '[{
		"EventBusName": "codely.domain_events",
		"Source": "codely",
		"DetailType": "codely.shop.user.archived",
		"Detail": "{ \"id\": \"123\" }"
	}]'

aws events put-events \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	--entries '[{
		"EventBusName": "codely.domain_events",
		"Source": "codely",
		"DetailType": "codely.shop.user.email.updated",
		"Detail": "{ \"id\": \"123\", \"new_email\": \"javi@yahoo.es\" }"
	}]'
