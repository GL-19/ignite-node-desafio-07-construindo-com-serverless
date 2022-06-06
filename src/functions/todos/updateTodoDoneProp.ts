import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { Errors } from "src/errors/Errors";
import { TodosRepository } from "src/repositories/TodosRepository";
import { UsersRepository } from "src/repositories/UsersRepository";

interface IRequestBody {
	done: boolean;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id, todo_id } = event.pathParameters;
		const requestBody = JSON.parse(event.body) as IRequestBody;
		const { done } = requestBody;

		if (!("done" in requestBody)) {
			throw new Errors.InvalidRequestBody();
		}

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

		const updatedTodo = await TodosRepository.updateDoneProp(todo_id, done);

		return {
			statusCode: 201,
			body: JSON.stringify({
				todo: updatedTodo,
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
