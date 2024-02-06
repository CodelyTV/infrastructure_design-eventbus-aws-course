RECEIPT_HANDLE="Mzc5NjE2NDgtNmY5OS00MmQ2LWFmM2UtZjhjODg0NTIwNTRiIGFybjphd3M6c3FzOnVzLWVhc3QtMTowMDAwMDAwMDAwMDA6c2VuZF93ZWxjb21lX2VtYWlsX29uX3VzZXJfcmVnaXN0ZXJlZCBlNWZlMWUwMC1kMjgxLTRmZTgtYWNkNy0zZDQ0MTdhYzExZjYgMTcwNjg3NzQ2NC4xNDI2MTY3"

aws sqs delete-message \
	--endpoint-url http://localhost:4566 \
	--region us-east-1 \
	--queue-url http://localhost:4566/000000000000/send_welcome_email_on_user_registered \
	--receipt-handle $RECEIPT_HANDLE
