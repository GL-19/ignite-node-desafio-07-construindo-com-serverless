import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { document } from "src/utils/dynamodbClient";
import { validate } from "uuid";

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

		const user = await document
			.get({
				TableName: "users",
				Key: {
					id: user_id,
				},
			})
			.promise();

		if (Object.keys(user).length === 0) {
			throw new AppError("User not found!", 404);
		}

		const todo = await document
			.get({
				TableName: "todos",
				Key: {
					id: todo_id,
				},
			})
			.promise();

		if (Object.keys(todo).length === 0) {
			throw new AppError("Todo not found!", 404);
		}

		await document
			.delete({
				TableName: "todos",
				Key: {
					id: todo_id,
				},
			})
			.promise();

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Todo deleted!",
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
