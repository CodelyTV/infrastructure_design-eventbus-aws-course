aws sqs receive-message \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	--queue-url http://localhost:4566/000000000000/send_welcome_email_on_user_registered
