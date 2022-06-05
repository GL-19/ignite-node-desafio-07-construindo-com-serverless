import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { validate } from "uuid";
import { AppError } from "src/errors/AppError";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id } = event.pathParameters;

		const isValidId = validate(user_id);

		if (!isValidId) {
			throw new AppError("Invalid user id!", 400);
		}

		const userQueryResponse = await document
			.query({
				TableName: "users",
				KeyConditionExpression: "id = :id",
				ExpressionAttributeValues: {
					":id": user_id,
				},
			})
			.promise();

		const user = userQueryResponse.Items[0];

		if (!user) {
			throw new AppError("User not found!", 404);
		}

		const todosQueryResponse = await document
			.scan({
				TableName: "todos",
				FilterExpression: "user_id = :id",
				ExpressionAttributeValues: {
					":id": user_id,
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
	} catch (err) {
		if (err instanceof AppError) {
			return {
				statusCode: err.statusCode,
				body: JSON.stringify({
					message: err.message,
				}),
			};
		} else {
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: "Internal Server Error!",
				}),
			};
		}
	}
};
