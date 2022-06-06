import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { UsersRepository } from "../../repositories/UsersRepository";
import { TodosRepository } from "../../repositories/TodosRepository";
import { Errors } from "src/errors/Errors";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id, todo_id } = event.pathParameters;

		const user = await UsersRepository.getById(user_id);

		if (!user) {
			throw new Errors.UserNotFound();
		}

		const todo = await TodosRepository.getById(todo_id);

		if (!todo) {
			throw new Errors.TodoNotFound();
		}

		if (user.id !== todo.user_id) {
			throw new Errors.Forbidden();
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
