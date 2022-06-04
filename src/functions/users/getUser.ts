import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { validate } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
	const { user_id } = event.pathParameters;

	const isValidId = validate(user_id);

	if (!isValidId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid user id!",
			}),
		};
	}

	const response = await document
		.query({
			TableName: "users",
			KeyConditionExpression: "id = :id",
			ExpressionAttributeValues: {
				":id": user_id,
			},
		})
		.promise();

	const user = response.Items[0];

	if (!user) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "User not found!",
			}),
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify({
			user,
		}),
	};
};
