# Event Bus
aws events \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	create-event-bus --name codely.domain_events

# Queue
aws sqs \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	create-queue --queue-name send_welcome_email_on_user_registered

# Subscription
aws events \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	put-rule --name rule-user_registered \
	         --event-bus-name codely.domain_events \
	         --event-pattern '{"detail-type": ["user.registered"]}'

aws events put-targets --endpoint-url http://localhost:4566 \
    --region us-east-1 \
    --event-bus-name codely.domain_events \
    --rule rule-user_registered \
    --targets "Id"="send_welcome_email_on_user_registered","Arn"="arn:aws:sqs:us-east-1:000000000000:send_welcome_email_on_user_registered"
