import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { validate } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
	const { user_id } = event.pathParameters;

	const isValidUserId = validate(user_id);

	if (!isValidUserId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Invalid user id!",
			}),
		};
	}

	const user = await document
		.get({
			TableName: "users",
			Key: {
				id: user_id,
			},
		})
		.promise();

	if (Object.keys(user).length < 1) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "User not found!",
			}),
		};
	}

	await document
		.delete({
			TableName: "users",
			Key: {
				id: user_id,
			},
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "User deleted!",
			user,
		}),
	};
};
