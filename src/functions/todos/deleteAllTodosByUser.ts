import { APIGatewayProxyHandler } from "aws-lambda";
import { AppError } from "src/errors/AppError";
import { Errors } from "src/errors/Errors";
import { TodosRepository } from "src/repositories/TodosRepository";
import { UsersRepository } from "src/repositories/UsersRepository";

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const { user_id } = event.pathParameters;

		const user = await UsersRepository.getById(user_id);

		if (!user) {
			throw new Errors.UserNotFound();
		}

		await TodosRepository.deleteAllByUserId(user_id);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Todos deleted with success!",
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
