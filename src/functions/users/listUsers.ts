import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async () => {
	const response = await document
		.scan({
			TableName: "users",
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify({
			users: response.Items,
		}),
	};
};
