curl --request POST \
  --url http://localhost:4001/api/subscriptions \
  --header 'Content-Type: application/json' \
  --data '{\n	"source":{\n		"type": "stocktwits",\n		"feed": "aapl"\n	},\n	"target":{\n		"type": "email",\n		"address": "yshayy7@mailinator.com"\n	}\n}'

curl --request GET \
  --url http://localhost:4001/api/subscriptions

curl --request DELETE \
  --url http://localhost:4001/api/subscriptions/5bb3dcf1d9b66b00398b168d \