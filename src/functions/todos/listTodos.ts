import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import * as usersRepository from "../../repositories/UsersRepository";
import * as todosRepository from "../../repositories/TodosRepository";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id } = event.pathParameters;

		const user = await usersRepository.getUserById(user_id);

		if (!user) {
			throw new AppError("User not found!", 404);
		}

		const todos = await todosRepository.listTodosByUserId(user_id);

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
