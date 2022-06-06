import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import * as usersRepository from "../../repositories/UsersRepository";
import * as todosRepository from "../../repositories/TodosRepository";
import { Todo } from "src/entities/Todo";

interface IRequestBody {
	title: string;
	deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { title, deadline } = JSON.parse(event.body) as IRequestBody;
		const { user_id } = event.pathParameters;

		if (!title || !deadline) {
			throw new AppError("Invalid body data!", 400);
		}

		const user = await usersRepository.getUserById(user_id);

		if (!user) {
			throw new AppError("User not found!", 404);
		}

		const todo = new Todo(user_id, title, deadline);

		await todosRepository.createTodo(todo);

		return {
			statusCode: 201,
			body: JSON.stringify({
				message: "Todo created!",
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
