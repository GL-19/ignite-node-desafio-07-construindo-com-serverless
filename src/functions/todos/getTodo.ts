import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/dynamodbClient";
import { validate } from "uuid";
import { AppError } from "src/errors/AppError";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id, todo_id } = event.pathParameters;

		const validUserId = validate(user_id);

		if (!validUserId) {
			throw new AppError("Invalid user id!", 400);
		}

		const validTodoId = validate(todo_id);

		if (!validTodoId) {
			throw new AppError("Invalid todo id!", 400);
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
			.query({
				TableName: "todos",
				KeyConditionExpression: "id = :id",
				ExpressionAttributeValues: {
					":id": todo_id,
				},
			})
			.promise();

		const todo = todosQueryResponse.Items[0];

		if (!todo) {
			throw new AppError("Todo not found!", 404);
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				todo,
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
