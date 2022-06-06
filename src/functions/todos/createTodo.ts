import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { UsersRepository } from "../../repositories/UsersRepository";
import { TodosRepository } from "../../repositories/TodosRepository";
import { Todo } from "src/entities/Todo";
import { Errors } from "src/errors/Errors";

interface IRequestBody {
	title: string;
	deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id } = event.pathParameters;
		const { title, deadline } = JSON.parse(event.body) as IRequestBody;

		if (!title || !deadline) {
			throw new Errors.InvalidRequestBody();
		}

		const user = await UsersRepository.getById(user_id);

		if (!user) {
			throw new Errors.UserNotFound();
		}

		const todo = new Todo(user_id, title, deadline);

		await TodosRepository.create(todo);

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
