import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { document } from "src/utils/dynamodbClient";
import * as usersRepository from "../../repositories/UsersRepository";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id, todo_id } = event.pathParameters;

		const user = await usersRepository.getUserById(user_id);

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
