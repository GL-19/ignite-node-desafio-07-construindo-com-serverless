import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { validate } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
	const { id } = event.pathParameters;

	const isValidId = validate(id);

	if (!isValidId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid user id!",
			}),
		};
	}

	const userQueryResponse = await document
		.query({
			TableName: "users",
			KeyConditionExpression: "id = :id",
			ExpressionAttributeValues: {
				":id": id,
			},
		})
		.promise();

	const user = userQueryResponse.Items[0];

	if (!user) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "User not found!",
			}),
		};
	}

	const todosQueryResponse = await document
		.scan({
			TableName: "todos",
			FilterExpression: "user_id = :id",
			ExpressionAttributeValues: {
				":id": id,
			},
		})
		.promise();

	const todos = todosQueryResponse.Items;

	return {
		statusCode: 200,
		body: JSON.stringify({
			todos,
		}),
	};
};
